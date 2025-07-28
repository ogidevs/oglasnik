const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    username: { type: String, required: true },
    action: { type: String, required: true },
    method: { type: String },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String },
    details: { type: String }
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;