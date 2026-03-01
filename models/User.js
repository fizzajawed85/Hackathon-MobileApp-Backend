const mongoose = require('mongoose');
// const JsonModel = require('../utils/json_db');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    profileImage: { type: String },
    phoneNumber: { type: String },
    location: { type: String },
    about: { type: String },
    socialProvider: { type: String },
    socialId: { type: String },
    otp: { type: String },
    otpExpire: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    healthStats: {
        heartRate: { type: String, default: '72' },
        bp: { type: String, default: '120/80' },
        steps: { type: String, default: '0' },
        sleep: { type: String, default: '0' }
    },
    medication: {
        name: { type: String },
        dosage: { type: String },
        instruction: { type: String },
        time: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
// module.exports = new JsonModel('User');
