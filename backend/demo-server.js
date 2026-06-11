require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Mock data
const mockTickets = [
  {
    ticket_id: 1,
    ticket_number: 'ECO-2024-001',
    customer_name: 'John Doe',
    phone: '+91-9876543210',
    vehicle_model: 'EcoRide E1 Pro',
    issue_type: 'Battery Issue',
    status: 'assigned',
    priority: 'high',
    created_at: new Date().toISOString(),
    technician_name: 'Raj Kumar',
    eta: '30 minutes'
  },
  {
    ticket_id: 2,
    ticket_number: 'ECO-2024-002',
    customer_name: 'Jane Smith',
    phone: '+91-9876543211',
    vehicle_model: 'EcoRide E1',
    issue_type: 'Motor Problem',
    status: 'in_progress',
    priority: 'medium',
    created_at: new Date().toISOString(),
    technician_name: 'Amit Singh'
  }
];

const mockTechnicians = [
  {
    technician_id: 1,
    name: 'Raj Kumar',
    phone: '+91-9876543220',
    status: 'available',
    current_location: { lat: 23.0225, lng: 72.5714 },
    assigned_tickets: 1
  },
  {
    technician_id: 2,
    name: 'Amit Singh',
    phone: '+91-9876543221',
    status: 'busy',
    current_location: { lat: 23.0325, lng: 72.5814 },
    assigned_tickets: 1
  }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Demo server running',
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/tickets', (req, res) => {
  res.json({ success: true, data: mockTickets });
});

app.get('/api/tickets/:id', (req, res) => {
  const ticket = mockTickets.find(t => t.ticket_id == req.params.id);
  if (ticket) {
    res.json({ success: true, data: ticket });
  } else {
    res.status(404).json({ success: false, message: 'Ticket not found' });
  }
});

app.post('/api/tickets', (req, res) => {
  const newTicket = {
    ticket_id: mockTickets.length + 1,
    ticket_number: `ECO-2024-${String(mockTickets.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'open',
    created_at: new Date().toISOString()
  };
  mockTickets.push(newTicket);
  
  // Emit to all connected clients
  io.emit('ticket_created', newTicket);
  
  res.json({ success: true, data: newTicket });
});

app.get('/api/technicians', (req, res) => {
  res.json({ success: true, data: mockTechnicians });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  if (email && password) {
    res.json({
      success: true,
      data: {
        user: {
          id: 1,
          email: email,
          name: 'Demo User',
          role: 'customer'
        },
        token: 'demo-jwt-token'
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
  });
  
  socket.on('location_update', (data) => {
    socket.broadcast.emit('technician_location', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: 'Demo server error'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Demo server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API endpoints available at: http://localhost:${PORT}/api/`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  GET  /api/tickets');
  console.log('  POST /api/tickets');
  console.log('  GET  /api/technicians');
  console.log('  POST /api/auth/login');
});

module.exports = { app, io };