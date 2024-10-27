const mongoose = require('mongoose');

const inverterDataSchema = new mongoose.Schema({
    inverterSn: String,
    sn: String,
    timestamp: { type: Date, default: Date.now },
    data: mongoose.Schema.Types.Mixed // Store the entire response data here for flexibility
});

module.exports = mongoose.model('InverterData', inverterDataSchema);
