const { format } = require('date-fns');

// Function to format log data
const formatLog = (logData) => {
    const { level, log_string, timestamp, metadata } = logData;
    const formattedTimestamp = format(new Date(timestamp), "yyyy-MM-dd'T'HH:mm:ssxxx");
    const logObject = {
        level,
        log_string,
        timestamp: formattedTimestamp,
        metadata: metadata ? metadata : {},
    };
    return JSON.stringify(logObject);
};

module.exports = { formatLog };