const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['info', 'error', 'success'],
    required: true,
  },
  log_string: { type: String, required: true, minlength: 1 },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    source: { type: String, required: true },
  },
}, { timestamps: true }); // Add timestamps for automatic document creation/update tracking

// Optional index for faster level-based queries
logSchema.index({ level: 1 });

module.exports = mongoose.model('Log', logSchema);
