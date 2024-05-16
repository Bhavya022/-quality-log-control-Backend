const { format } = require('date-fns'); // Assuming using date-fns for timestamp formatting

// Function to search logs by various criteria
const searchLogs = (logs, filters = {}) => {
  return logs.filter((log) => {
    const { timestamp, level, log_string, metadata } = log;

    // Apply filters based on provided criteria
    const matchesTimestamp = !filters.hasOwnProperty('timestamp') || format(new Date(timestamp), "yyyy-MM-dd'T'HH:mm:ssxxx") === filters.timestamp;
    const matchesLevel = !filters.hasOwnProperty('level') || log.level === filters.level;
    const matchesMessage = !filters.hasOwnProperty('log_string') || log_string.includes(filters.log_string);
    const matchesSource = !filters.hasOwnProperty('source') || metadata.source === filters.source;

    // Return true if all filter criteria match
    return matchesTimestamp && matchesLevel && matchesMessage && matchesSource;
  });
};

// Function to validate search filters (optional)
const validateFilters = (filters) => {
  const allowedFilters = ['timestamp', 'level', 'log_string', 'source'];
  const invalidKeys = Object.keys(filters).filter((key) => !allowedFilters.includes(key));

  if (invalidKeys.length > 0) {
    throw new Error(`Invalid filter keys: ${invalidKeys.join(', ')}`);
  }

  // You can add further validation for specific filter values (e.g., timestamp format)
};

module.exports = {
  searchLogs,
  validateFilters: validateFilters || (() => {}), // Optional validation with default no-op function
};
