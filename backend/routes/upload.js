const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

/**
 * @swagger
 * /api/upload/ticket-media:
 *   post:
 *     summary: Upload photos/videos for a ticket
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: files
 *         type: file
 *         required: true
 *         description: Media files to upload
 *       - in: formData
 *         name: ticket_id
 *         type: string
 *         required: true
 *       - in: formData
 *         name: category
 *         type: string
 *         enum: [before, after, parts, damage, other]
 *         required: true
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 */
router.post('/ticket-media', authenticateToken, upload.array('files', 5), async (req, res) => {
  try {
    const { ticket_id, category } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!ticket_id || !category) {
      return res.status(400).json({ error: 'ticket_id and category are required' });
    }

    // Verify ticket exists and user has access
    const ticketCheck = await pool.query(
      'SELECT ticket_id FROM tickets WHERE ticket_id = $1',
      [ticket_id]
    );

    if (ticketCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const mediaType = file.mimetype.startsWith('image/') ? 'photo' : 'video';
      const fileUrl = `/uploads/${file.filename}`;

      const result = await pool.query(
        `INSERT INTO photos_videos (media_id, ticket_id, uploaded_by, media_type, file_url, category, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          uuidv4(),
          ticket_id,
          req.user.user_id,
          mediaType,
          fileUrl,
          category,
          JSON.stringify({
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype
          })
        ]
      );

      uploadedFiles.push(result.rows[0]);
    }

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

/**
 * @swagger
 * /api/upload/ticket-media/{ticket_id}:
 *   get:
 *     summary: Get media files for a ticket
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of media files
 */
router.get('/ticket-media/:ticket_id', authenticateToken, async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const result = await pool.query(
      `SELECT pv.*, u.name as uploaded_by_name
       FROM photos_videos pv
       JOIN users u ON pv.uploaded_by = u.user_id
       WHERE pv.ticket_id = $1
       ORDER BY pv.uploaded_at DESC`,
      [ticket_id]
    );

    res.json({ media: result.rows });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: 'Failed to get media files' });
  }
});

module.exports = router;