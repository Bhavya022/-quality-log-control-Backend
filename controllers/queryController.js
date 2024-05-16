const fs = require('fs').promises; // Use promises for async file operations
const path = require('path');
const moment = require('moment'); // For date range filtering
const config = require('../config')
//console.log(config)
// Error handling class (optional)
class QueryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'QueryError';
  }
}

// Query Interface Controller
class QueryController {
  constructor() {
    //console.log(config)
    // Load logs directory path from configuration
    this.logsDirectory = config.logPaths || path.join(__dirname, '../logs');
  }

  // Asynchronous log searching method with pagination
  async searchLogs(filters, page = 1, pageSize = 10) {
    try {
      const logFiles = await fs.readdir(this.logsDirectory);
      const searchResults = [];

      for (const file of logFiles) {
        const logFilePath = path.join(this.logsDirectory, file);
        const logs = await fs.readFile(logFilePath, 'utf-8');

        for (const logLine of logs.split('\n')) {
          if (logLine.trim() !== '') {
            try {
              const logData = JSON.parse(logLine);
              if (this.applyFilters(filters, logData)) {
                searchResults.push(logData);
              }
            } catch (error) {
              console.error(`Error parsing log file ${file}: ${error}`);
            }
          }
        }
      }

      // Pagination logic (slice results based on page and pageSize)
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, searchResults.length);
      const paginatedResults = searchResults.slice(startIndex, endIndex);

      return { results: paginatedResults, total: searchResults.length };
    } catch (error) {
      throw new QueryError(`Error searching logs: ${error.message}`);
    }
  }

  // Apply filters to log data (extendable for new filters)
  applyFilters(filters, logData) {
    return (
      (!filters.level || logData.level === filters.level) &&
      (!filters.log_string || logData.log_string.includes(filters.log_string)) &&
      (!filters.timestamp || this.filterByDate(filters.timestamp, logData.timestamp)) &&
      (!filters.source || logData.metadata.source === filters.source)
    );
  }

  // Filter by date range (bonus)
  filterByDate(filterDate, logTimestamp) {
    if (!filterDate) return true; // No date filter provided

    const momentLogTime = moment(logTimestamp);
    const startDate = moment(filterDate.from);
    const endDate = moment(filterDate.to).endOf('day'); // Include end of day

    return momentLogTime.isBetween(startDate, endDate, 'inclusive');
  }

  // Log search endpoint with pagination handling
  async search(req, res) {
    try {
      const filters = req.query;
      const page = parseInt(req.query.page || 1); // Default to page 1
      const pageSize = parseInt(req.query.pageSize || 10); // Default page size 10

      const searchResults = await this.searchLogs(filters, page, pageSize);
      res.status(200).json(searchResults);
    } catch (error) {
      if (error instanceof QueryError) {
        res.status(400).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Error searching logs!' });
      }
    }
  }
}

module.exports = QueryController;
