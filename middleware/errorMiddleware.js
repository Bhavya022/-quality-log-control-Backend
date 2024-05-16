const { isProd } = require('./config'); // Assuming a config file with isProd flag

const errorMiddleware = (err, req, res, next) => {
  // Log the error (configurable)
  console.error(err.stack); // Replace with your preferred logging library

  const statusCode = err.statusCode || 500; // Use error status code if available
  const message = isProd ? 'Internal server error' : err.message || 'Something went wrong!';

  res.status(statusCode).json({ error: message });
};

module.exports = errorMiddleware;
