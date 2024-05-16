// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const requestLoggerMiddleware = require('./middleware/requestLoggerMiddleware');
// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

console.log(requestLoggerMiddleware);
// // Use request logger middleware
 app.use(requestLoggerMiddleware);

// Routes
const ingestorRoutes = require('./routes/ingestorRoutes');
const queryRoutes = require('./routes/queryRoutes'); 

// Use routes
app.use('/api/ingestor', ingestorRoutes);
app.use('/api/query', queryRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
