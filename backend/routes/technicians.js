const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

/**
 * @swagger
 * /api/technicians/assignments:
 *   get:
 *     summary: Get technician's assigned tickets
 *     tags: [Technicians]
 *     responses:
 *       200:
 *         description: List of assigned tickets
 */
router.get('/assignments', authenticateToken, authorizeRoles('technician'), async (req, res) => {
  try {
    const query = `
      SELECT t.*, u.name as customer_name, u.phone as customer_phone,
             v.vin, v.model as vehicle_model, a.assignment_status
      FROM tickets t
      JOIN assignments a ON t.ticket_id = a.ticket_id
      JOIN users u ON t.customer_id = u.user_id
      JOIN vehicles v ON t.vehicle_id = v.vehicle_id
      JOIN technicians tech ON a.technician_id = tech.technician_id
      WHERE tech.user_id = $1
        AND a.assignment_status IN ('assigned', 'accepted', 'started')
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query, [req.user.user_id]);
    res.json({ tickets: result.rows });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to get assignments' });
  }
});

/**
 * @swagger
 * /api/technicians/location:
 *   put:
 *     summary: Update technician location
 *     tags: [Technicians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               accuracy:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated successfully
 */
router.put('/location', authenticateToken, authorizeRoles('technician'), async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    const locationData = {
      latitude,
      longitude,
      accuracy,
      timestamp: new Date().toISOString()
    };

    await pool.query(
      `UPDATE technicians 
       SET current_location = $1, last_location_update = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [JSON.stringify(locationData), req.user.user_id]
    );

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

module.exports = router;