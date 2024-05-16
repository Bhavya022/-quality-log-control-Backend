const fs = require('fs').promises; // Use promises for asynchronous file operations
const path = require('path');
const { format } = require('date-fns');

// Log Ingestor Controller
class LogController {
  constructor(config) {
    // Load log file paths from configuration
    this.logFilePaths = config.logs || {};
  }

  // Log formatting method
  formatLog(logData) {
    const { level, log_string, timestamp, metadata } = logData;
    const formattedTimestamp = format(new Date(timestamp), "yyyy-MM-dd'T'HH:mm:ssxxx");
    const logObject = {
      level,
      log_string,
      timestamp: formattedTimestamp,
      metadata: metadata ? metadata : {},
    };
    return JSON.stringify(logObject);
  }

  // Asynchronous log writing method
  async writeLog(logData, apiName) {
    const formattedLog = this.formatLog(logData);
    const logFilePath = this.logFilePaths[apiName];

    if (!logFilePath) {
      console.error(`Invalid API name: ${apiName}. Log not written.`);
      return;
    }

    try {
      await fs.appendFile(logFilePath, formattedLog + '\n');
    } catch (error) {
      console.error(`Error writing log to ${logFilePath}: ${error}`);
    }
  }

  // Log ingestion endpoint (with async/await)
  async ingestLog(req, res) {
    try {
      const { logData, apiName } = req.body;
      await this.writeLog(logData, apiName);
      res.status(200).json({ message: 'Log ingested successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error ingesting log!' });
    }
  }
}

module.exports = LogController;
