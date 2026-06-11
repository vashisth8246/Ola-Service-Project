const cron = require('node-cron');
const { pool } = require('../config/database');
const { sendNotification } = require('./notificationService');

class SLAService {
  static startSLAMonitor() {
    // Run SLA check every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      try {
        await this.checkSLABreaches();
        await this.checkEscalations();
      } catch (error) {
        console.error('SLA Monitor error:', error);
      }
    });

    console.log('✅ SLA Monitor started');
  }

  static async checkSLABreaches() {
    const query = `
      SELECT t.ticket_id, t.ticket_number, t.customer_id, t.priority, 
             t.status, t.sla_due_time, u.name as customer_name, u.phone
      FROM tickets t
      JOIN users u ON t.customer_id = u.user_id
      WHERE t.status NOT IN ('completed', 'closed', 'cancelled')
        AND t.sla_due_time < NOW()
        AND NOT EXISTS (
          SELECT 1 FROM escalations e 
          WHERE e.ticket_id = t.ticket_id 
          AND e.status = 'open'
        )
    `;

    const result = await pool.query(query);
    
    for (const ticket of result.rows) {
      await this.escalateTicket(ticket);
    }
  }

  static async escalateTicket(ticket) {
    try {
      // Create escalation record
      const escalationQuery = `
        INSERT INTO escalations (
          escalation_id, ticket_id, escalation_reason, 
          description, status, escalated_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
      `;

      await pool.query(escalationQuery, [
        require('uuid').v4(),
        ticket.ticket_id,
        'sla_breach',
        `SLA breach for ${ticket.priority} priority ticket`,
        'open'
      ]);

      // Update ticket status if not already escalated
      if (ticket.status !== 'escalated') {
        await pool.query(
          'UPDATE tickets SET status = $1 WHERE ticket_id = $2',
          ['escalated', ticket.ticket_id]
        );
      }

      // Send notifications
      await this.sendEscalationNotifications(ticket);

      console.log(`Escalated ticket: ${ticket.ticket_number}`);
    } catch (error) {
      console.error('Escalation error:', error);
    }
  }

  static async sendEscalationNotifications(ticket) {
    // Notify customer
    await sendNotification({
      type: 'sms',
      to: ticket.phone,
      message: `Your service request ${ticket.ticket_number} has been escalated due to delay. Our supervisor will contact you shortly.`
    });

    // Notify supervisors/admins
    const supervisors = await pool.query(
      'SELECT phone FROM users WHERE user_type = $1 AND is_active = true',
      ['admin']
    );

    for (const supervisor of supervisors.rows) {
      await sendNotification({
        type: 'sms',
        to: supervisor.phone,
        message: `ESCALATION: Ticket ${ticket.ticket_number} (${ticket.priority}) has breached SLA. Customer: ${ticket.customer_name}`
      });
    }
  }

  static async checkEscalations() {
    // Check for tickets that need re-escalation (24h without resolution)
    const query = `
      SELECT e.*, t.ticket_number, t.priority
      FROM escalations e
      JOIN tickets t ON e.ticket_id = t.ticket_id
      WHERE e.status = 'open'
        AND e.escalated_at < NOW() - INTERVAL '24 hours'
        AND t.status NOT IN ('completed', 'closed', 'cancelled')
    `;

    const result = await pool.query(query);
    
    for (const escalation of result.rows) {
      // Send reminder notifications
      console.log(`Re-escalating ticket: ${escalation.ticket_number}`);
    }
  }

  static async calculateSLAMetrics(startDate, endDate) {
    const query = `
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(CASE WHEN sla_due_time > completed_at THEN 1 END) as sla_met,
        COUNT(CASE WHEN sla_due_time <= completed_at THEN 1 END) as sla_breached,
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/3600) as avg_resolution_hours,
        priority,
        issue_category
      FROM tickets
      WHERE created_at BETWEEN $1 AND $2
        AND status IN ('completed', 'closed')
      GROUP BY priority, issue_category
      ORDER BY priority, issue_category
    `;

    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }
}

function startSLAMonitor() {
  SLAService.startSLAMonitor();
}

module.exports = { startSLAMonitor, SLAService };