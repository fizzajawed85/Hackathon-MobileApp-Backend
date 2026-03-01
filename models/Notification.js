const mongoose = require('mongoose');
// const JsonModel = require('../utils/json_db');

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'info' }, // 'info', 'appointment', 'record'
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
// const Notification = new JsonModel('Notification');
// module.exports = Notification;
