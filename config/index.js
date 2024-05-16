require('dotenv').config();
const path = require('path');
// Define configuration object
const config = {
  // Define API keys or any sensitive information here
  apiKey: process.env.API_KEY,

  // Define paths for log files
  logPaths: {
    api1: path.join(__dirname, '../logs/log1.log'),
    api2: path.join(__dirname, '../logs/log2.log'),
    // Add more log paths as needed
  },

  // Define other configuration variables here
};

module.exports = config;