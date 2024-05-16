const express = require('express');
const router = express.Router();
const validator = require('validator'); // Optional for input validation
const LogController = require('../controllers/logController');
// Load configuration (replace with your logic)
const config = require('../config') || {}; // Fallback to empty object

// Initialize LogController with configuration
const logController = new LogController(config.logs || {}); // Fallback to empty logs object

// POST route for ingesting logs (with optional validation)
router.post('/ingest', (req, res) => {
  try {
    // Optional validation (adjust based on your log format)
    if (!req.body ) {
      throw new Error('Invalid request body. Expected an object.');
    }
    const { logData, apiName } = req.body;
    if (!logData || typeof logData !== 'object') {
      throw new Error('Invalid logData. Expected an object.');
    }
    if (!apiName || typeof apiName !== 'string' || !apiName.trim()) {
      throw new Error('Invalid apiName. Expected a non-empty string.');
    }

    logController.ingestLog(req, res);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
