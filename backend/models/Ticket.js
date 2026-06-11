const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - customer_id
 *         - vehicle_id
 *         - issue_category
 *         - issue_description
 *         - location_data
 *       properties:
 *         ticket_id:
 *           type: string
 *           format: uuid
 *         ticket_number:
 *           type: string
 *           example: "TKT-2024-001234"
 *         customer_id:
 *           type: string
 *           format: uuid
 *         vehicle_id:
 *           type: string
 *           format: uuid
 *         issue_category:
 *           type: string
 *           enum: [battery, motor, brake, electrical, body, other]
 *         issue_description:
 *           type: string
 *         location_data:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *             address:
 *               type: string
 *         priority:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         status:
 *           type: string
 *           enum: [created, assigned, en_route, arrived, in_progress, completed, closed, cancelled]
 */

class Ticket {
  static async create(ticketData) {
    const ticketId = uuidv4();
    const ticketNumber = await this.generateTicketNumber();
    const slaStartTime = new Date();
    const slaDueTime = this.calculateSLADueTime(ticketData.priority);

    const query = `
      INSERT INTO tickets (
        ticket_id, ticket_number, customer_id, vehicle_id, 
        issue_category, issue_description, location_data, 
        priority, status, sla_start_time, sla_due_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      ticketId, ticketNumber, ticketData.customer_id, ticketData.vehicle_id,
      ticketData.issue_category, ticketData.issue_description, 
      JSON.stringify(ticketData.location_data), ticketData.priority || 'medium',
      'created', slaStartTime, slaDueTime
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(ticketId) {
    const query = `
      SELECT t.*, u.name as customer_name, u.phone as customer_phone,
             v.vin, v.model as vehicle_model
      FROM tickets t
      JOIN users u ON t.customer_id = u.user_id
      JOIN vehicles v ON t.vehicle_id = v.vehicle_id
      WHERE t.ticket_id = $1
    `;
    const result = await pool.query(query, [ticketId]);
    return result.rows[0];
  }

  static async updateStatus(ticketId, status, updatedBy) {
    const query = `
      UPDATE tickets 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE ticket_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, ticketId]);
    
    // Log status change event
    if (result.rows[0]) {
      await this.logEvent(ticketId, 'status_change', { 
        old_status: result.rows[0].status, 
        new_status: status 
      }, updatedBy);
    }
    
    return result.rows[0];
  }

  static async logEvent(ticketId, eventType, eventData, userId) {
    const query = `
      INSERT INTO ticket_events (event_id, ticket_id, user_id, event_type, event_data)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [uuidv4(), ticketId, userId, eventType, JSON.stringify(eventData)]);
  }

  static async generateTicketNumber() {
    const year = new Date().getFullYear();
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM tickets WHERE EXTRACT(YEAR FROM created_at) = $1',
      [year]
    );
    const count = parseInt(result.rows[0].count) + 1;
    return `TKT-${year}-${count.toString().padStart(6, '0')}`;
  }

  static calculateSLADueTime(priority) {
    const now = new Date();
    const slaMinutes = {
      'critical': 60,
      'high': 240,
      'medium': 480,
      'low': 720
    };
    return new Date(now.getTime() + (slaMinutes[priority] || 480) * 60000);
  }
}

module.exports = Ticket;