const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
});

const requestLoggerMiddleware = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip, // Consider security implications of logging IP addresses
    // Add other relevant request details here (if needed)
  });

  next();

  // Optional: Log response details after request processing
  res.on('finish', () => {
    logger.info(`${res.statusCode} - ${res.statusMessage} - ${req.originalUrl}`);
  });
};

module.exports = requestLoggerMiddleware;
