const jwt = require('jsonwebtoken');
const { getRedisClient } = require('../config/redis');

function setupSocketHandlers(io) {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userType = decoded.userType;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userType})`);

    // Join user-specific room
    socket.join(`user:${socket.userId}`);
    
    // Join role-specific rooms
    socket.join(`role:${socket.userType}`);



    // Handle ticket room joining
    socket.on('join-ticket', (ticketId) => {
      socket.join(`ticket:${ticketId}`);
      console.log(`User ${socket.userId} joined ticket room: ${ticketId}`);
    });

    // Handle ticket room leaving
    socket.on('leave-ticket', (ticketId) => {
      socket.leave(`ticket:${ticketId}`);
      console.log(`User ${socket.userId} left ticket room: ${ticketId}`);
    });

    // Handle location updates for tracking
    socket.on('update-location', async (data) => {
      if (socket.userType !== 'technician') return;

      try {
        const { ticketId, latitude, longitude, eta } = data;
        
        // Broadcast location update to ticket room
        socket.to(`ticket:${ticketId}`).emit('technician-location-update', {
          latitude,
          longitude,
          eta,
          timestamp: new Date().toISOString()
        });
        
        // Store in Redis for persistence
        const redis = getRedisClient();
        await redis.setEx(
          `location:${ticketId}:${socket.userId}`,
          300,
          JSON.stringify({ latitude, longitude, eta, timestamp: new Date().toISOString() })
        );
      } catch (error) {
        console.error('Location update error:', error);
      }
    });

    // Handle chat messages
    socket.on('chat:message', async (data) => {
      try {
        // Validate and store message
        const message = {
          message_id: require('uuid').v4(),
          ticket_id: data.ticket_id,
          sender_id: socket.userId,
          message: data.message,
          timestamp: new Date().toISOString()
        };

        // Broadcast to ticket room
        io.to(`ticket:${data.ticket_id}`).emit('chat:message', message);
      } catch (error) {
        console.error('Chat message error:', error);
      }
    });

    // Handle technician status updates
    socket.on('technician:status_update', async (data) => {
      if (socket.userType !== 'technician') return;

      try {
        const redis = getRedisClient();
        await redis.setEx(
          `tech:status:${socket.userId}`,
          3600,
          JSON.stringify({
            status: data.status,
            timestamp: new Date().toISOString()
          })
        );

        // Notify admin dashboard
        socket.to('role:admin').emit('technician:status_changed', {
          technician_id: socket.userId,
          status: data.status,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Status update error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  // Utility functions for emitting events
  io.emitToUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
  };

  io.emitToRole = (role, event, data) => {
    io.to(`role:${role}`).emit(event, data);
  };

  io.emitToTicket = (ticketId, event, data) => {
    io.to(`ticket:${ticketId}`).emit(event, data);
  };

  return io;
}

module.exports = { setupSocketHandlers };