const twilio = require('twilio');

// Only initialize Twilio client if valid credentials are provided
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

class NotificationService {
  static async sendNotification({ type, to, message, data = {} }) {
    try {
      switch (type) {
        case 'sms':
          return await this.sendSMS(to, message);
        case 'whatsapp':
          return await this.sendWhatsApp(to, message);
        case 'push':
          return await this.sendPushNotification(to, message, data);
        default:
          throw new Error(`Unsupported notification type: ${type}`);
      }
    } catch (error) {
      console.error('Notification error:', error);
      throw error;
    }
  }

  static async sendSMS(to, message) {
    if (!client) {
      console.log(`SMS (Mock): ${to} - ${message}`);
      return { success: true, mock: true };
    }

    try {
      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });

      console.log(`SMS sent: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('SMS error:', error);
      throw error;
    }
  }

  static async sendWhatsApp(to, message) {
    if (!client) {
      console.log(`WhatsApp (Mock): ${to} - ${message}`);
      return { success: true, mock: true };
    }

    try {
      const result = await client.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:${to}`
      });

      console.log(`WhatsApp sent: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('WhatsApp error:', error);
      throw error;
    }
  }

  static async sendPushNotification(userId, message, data) {
    // In production, integrate with FCM/APNS
    console.log(`Push notification: ${userId} - ${message}`, data);
    
    // For now, emit via Socket.IO if available
    const io = global.io;
    if (io) {
      io.emitToUser(userId, 'notification', {
        message,
        data,
        timestamp: new Date().toISOString()
      });
    }

    return { success: true, mock: true };
  }

  // Template-based notifications
  static async sendTicketCreated(ticket, customer) {
    const message = `Your service request ${ticket.ticket_number} has been created. We'll assign a technician shortly. Track: ${process.env.FRONTEND_URL}/track/${ticket.ticket_id}`;
    
    await this.sendNotification({
      type: 'sms',
      to: customer.phone,
      message
    });
  }

  static async sendTechnicianAssigned(ticket, customer, technician) {
    const message = `Technician ${technician.name} has been assigned to your request ${ticket.ticket_number}. Contact: ${technician.phone}. ETA: ${technician.eta || '45'} minutes.`;
    
    await this.sendNotification({
      type: 'sms',
      to: customer.phone,
      message
    });
  }

  static async sendTechnicianEnRoute(ticket, customer, eta) {
    const message = `Your technician is on the way! ETA: ${eta} minutes. Track live location in the app.`;
    
    await this.sendNotification({
      type: 'push',
      to: customer.user_id,
      message
    });
  }

  static async sendServiceCompleted(ticket, customer) {
    const message = `Your service request ${ticket.ticket_number} has been completed. Please rate your experience: ${process.env.FRONTEND_URL}/feedback/${ticket.ticket_id}`;
    
    await this.sendNotification({
      type: 'sms',
      to: customer.phone,
      message
    });
  }
}

async function sendNotification(options) {
  return NotificationService.sendNotification(options);
}

module.exports = { NotificationService, sendNotification };