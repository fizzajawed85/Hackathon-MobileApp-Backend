const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    recordType: {
        type: String,
        default: 'Other'
    },
    fileUrl: {
        type: String,
        default: ''
    },
    // Keep clinical fields optional for compatibility with appointment history
    doctorName: {
        type: String
    },
    date: {
        type: String
    },
    diagnosis: {
        type: String
    },
    notes: {
        type: String
    },
    prescription: [{
        medicine: { type: String },
        dosage: { type: String },
        duration: { type: String }
    }],
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
