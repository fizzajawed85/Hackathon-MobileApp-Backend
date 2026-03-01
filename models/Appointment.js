const mongoose = require('mongoose');
// const JsonModel = require('../utils/json_db');

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    doctorName: { type: String, required: true },
    specialty: { type: String },
    doctorImageUrl: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, default: 'Confirmed' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
// module.exports = new JsonModel('Appointment');
