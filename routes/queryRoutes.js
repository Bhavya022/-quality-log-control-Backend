const express = require('express');
const QueryController = require('../controllers/queryController');

const router = express.Router();
const queryController = new QueryController();

// Route for log search with filters
router.get('/search', (req, res) => {
  queryController.search(req, res);
});

// Optional route for retrieving all logs (without filters)
router.get('/all', (req, res) => {
  const filters = {}; // Empty filters to retrieve all logs
  queryController.search(req, res, filters); // Pass empty filters
});

router.post('/search', (req, res) => {
  try {
    // Call the search method of QueryController
    queryController.search(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
