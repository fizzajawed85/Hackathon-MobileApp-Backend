require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const userRoutes = require('./routes/user.routes');
const recordsRoutes = require('./routes/records.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const notificationRoutes = require('./routes/notification.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hunging
})
    .then(() => console.log('✅ MongoDB Connected (Atlas)'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('⚠️ Falling back to Local JSON Database (Demo Mode)');
    });

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Medical Appointment & Records Management API',
        status: 'Running',
        endpoints: {
            auth: '/api/auth',
            appointments: '/api/appointments',
            user: '/api/user',
            records: '/api/records',
            notifications: '/api/notifications',
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

app.get('/test', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({ server: 'Running', database: dbStatus });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://0.0.0.0:${PORT}`));
}

module.exports = app;

process.on('unhandledRejection', (err) => {
    console.log('❌ UNHANDLED REJECTION!', err.name, err.message);
    if (process.env.NODE_ENV !== 'production') process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.log('❌ UNCAUGHT EXCEPTION!', err.name, err.message);
    if (process.env.NODE_ENV !== 'production') process.exit(1);
});
