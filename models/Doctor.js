const mongoose = require('mongoose');
// const JsonModel = require('../utils/json_db');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    imageUrl: { type: String },
    availableSlots: [{
        day: { type: String },
        time: { type: String }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
// module.exports = new JsonModel('Doctor');
