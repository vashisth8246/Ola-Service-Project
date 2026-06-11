const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const mapMyIndiaService = require('../services/mapMyIndiaService');

const router = express.Router();

/**
 * @swagger
 * /api/location/geocode:
 *   post:
 *     summary: Convert address to coordinates
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Geocoding result
 */
router.post('/geocode', authenticateToken, async (req, res) => {
  try {
    const { address } = req.body;

    if (!process.env.MAPMYINDIA_API_KEY) {
      // Mock response for development
      return res.json({
        results: [{
          geometry: {
            location: {
              lat: 12.9716,
              lng: 77.5946
            }
          },
          formatted_address: address
        }]
      });
    }

    const result = await mapMyIndiaService.geocode(address);
    res.json(result);
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

/**
 * @swagger
 * /api/location/reverse-geocode:
 *   post:
 *     summary: Convert coordinates to address
 *     tags: [Location]
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
 *     responses:
 *       200:
 *         description: Reverse geocoding result
 */
router.post('/reverse-geocode', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!process.env.MAPMYINDIA_API_KEY) {
      // Mock response for development
      return res.json({
        results: [{
          formatted_address: `${latitude}, ${longitude}`,
          address_components: []
        }]
      });
    }

    const result = await mapMyIndiaService.reverseGeocode(latitude, longitude);
    res.json(result);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({ error: 'Reverse geocoding failed' });
  }
});

/**
 * @swagger
 * /api/location/directions:
 *   post:
 *     summary: Get directions between two points
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *     responses:
 *       200:
 *         description: Directions result
 */
router.post('/directions', authenticateToken, async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!process.env.MAPMYINDIA_API_KEY) {
      // Mock response for development
      return res.json({
        routes: [{
          legs: [{
            duration: { text: '25 mins', value: 1500 },
            distance: { text: '8.5 km', value: 8500 }
          }]
        }]
      });
    }

    const result = await mapMyIndiaService.getDirections(origin, destination);
    res.json(result);
  } catch (error) {
    console.error('Directions error:', error);
    res.status(500).json({ error: 'Failed to get directions' });
  }
});

/**
 * @swagger
 * /api/location/nearby:
 *   post:
 *     summary: Find nearby service centers
 *     tags: [Location]
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
 *               keywords:
 *                 type: string
 *                 default: service center
 *               radius:
 *                 type: number
 *                 default: 1000
 *     responses:
 *       200:
 *         description: Nearby places result
 */
router.post('/nearby', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, keywords = 'service center', radius = 1000 } = req.body;

    if (!process.env.MAPMYINDIA_API_KEY) {
      return res.json({
        suggestedLocations: [{
          placeName: 'Ola Service Center',
          placeAddress: 'Sample Address, Bangalore',
          latitude: 12.9716,
          longitude: 77.5946,
          distance: 500
        }]
      });
    }

    const result = await mapMyIndiaService.findNearby(latitude, longitude, keywords, radius);
    res.json(result);
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({ error: 'Nearby search failed' });
  }
});

/**
 * @swagger
 * /api/location/autosuggest:
 *   post:
 *     summary: Auto-suggest places
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auto-suggest result
 */
router.post('/autosuggest', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;

    if (!process.env.MAPMYINDIA_API_KEY) {
      return res.json({
        suggestedLocations: [{
          placeName: query,
          placeAddress: `Sample address for ${query}`,
          latitude: 12.9716,
          longitude: 77.5946
        }]
      });
    }

    const result = await mapMyIndiaService.autoSuggest(query);
    res.json(result);
  } catch (error) {
    console.error('Auto-suggest error:', error);
    res.status(500).json({ error: 'Auto-suggest failed' });
  }
});

/**
 * @swagger
 * /api/location/distance-matrix:
 *   post:
 *     summary: Get distance matrix for multiple locations
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origins:
 *                 type: string
 *               destinations:
 *                 type: string
 *     responses:
 *       200:
 *         description: Distance matrix result
 */
router.post('/distance-matrix', authenticateToken, async (req, res) => {
  try {
    const { origins, destinations } = req.body;

    if (!process.env.MAPMYINDIA_API_KEY) {
      return res.json({
        results: {
          distances: [[{ distance: 8500, duration: 1500 }]]
        }
      });
    }

    const result = await mapMyIndiaService.getDistanceMatrix(origins, destinations);
    res.json(result);
  } catch (error) {
    console.error('Distance matrix error:', error);
    res.status(500).json({ error: 'Distance matrix failed' });
  }
});

module.exports = router;