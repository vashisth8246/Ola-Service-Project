const express = require('express');
const Joi = require('joi');
const Ticket = require('../models/Ticket');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Validation schemas
const createTicketSchema = Joi.object({
  customer_id: Joi.string().uuid().required(),
  vehicle_id: Joi.string().uuid().required(),
  issue_category: Joi.string().valid('battery', 'motor', 'brake', 'electrical', 'body', 'other').required(),
  issue_description: Joi.string().min(10).max(500).required(),
  location_data: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    address: Joi.string().required(),
    landmark: Joi.string().optional()
  }).required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  preferred_time: Joi.date().optional()
});

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new service ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = createTicketSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const ticket = await Ticket.create(value);
    
    // Emit real-time event for new ticket
    req.app.get('io').emit('ticket:created', {
      ticket_id: ticket.ticket_id,
      customer_id: ticket.customer_id,
      location: value.location_data,
      priority: ticket.priority
    });

    res.status(201).json({ ticket });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Ticket details
 *       404:
 *         description: Ticket not found
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check access permissions
    if (req.user.user_type === 'customer' && ticket.customer_id !== req.user.user_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Failed to retrieve ticket' });
  }
});

/**
 * @swagger
 * /api/tickets/{id}/status:
 *   put:
 *     summary: Update ticket status
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [assigned, en_route, arrived, in_progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['assigned', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const ticket = await Ticket.updateStatus(req.params.id, status, req.user.user_id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Emit real-time status update
    req.app.get('io').emit('ticket:status_updated', {
      ticket_id: ticket.ticket_id,
      status: status,
      updated_at: new Date()
    });

    res.json({ ticket });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get tickets with filters
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of tickets
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT t.*, u.name as customer_name, v.vin, v.model as vehicle_model
      FROM tickets t
      JOIN users u ON t.customer_id = u.user_id
      JOIN vehicles v ON t.vehicle_id = v.vehicle_id
      WHERE 1=1
    `;
    const params = [];

    // Add filters based on user role
    if (req.user.user_type === 'customer') {
      query += ` AND t.customer_id = $${params.length + 1}`;
      params.push(req.user.user_id);
    }

    if (status) {
      query += ` AND t.status = $${params.length + 1}`;
      params.push(status);
    }

    if (priority) {
      query += ` AND t.priority = $${params.length + 1}`;
      params.push(priority);
    }

    query += ` ORDER BY t.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total FROM tickets t
      WHERE 1=1
    `;
    const countParams = [];
    
    if (req.user.user_type === 'customer') {
      countQuery += ` AND t.customer_id = $${countParams.length + 1}`;
      countParams.push(req.user.user_id);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      tickets: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to retrieve tickets' });
  }
});

/**
 * @swagger
 * /api/tickets/track/{ticketNumber}:
 *   get:
 *     summary: Track ticket by number (public endpoint)
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticketNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket tracking information
 */
router.get('/track/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    
    // Mock response for demo
    const mockTicket = {
      id: 1,
      ticket_number: ticketNumber,
      status: 'in_progress',
      issue_description: 'Battery not charging properly',
      priority: 'high',
      created_at: new Date().toISOString(),
      technician_name: 'Rajesh Kumar',
      customer_location: {
        latitude: 12.9716,
        longitude: 77.5946
      }
    };
    
    res.json(mockTicket);
  } catch (error) {
    console.error('Error tracking ticket:', error);
    res.status(500).json({ error: 'Failed to track ticket' });
  }
});

module.exports = router;