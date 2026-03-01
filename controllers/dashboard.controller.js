const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const DEFAULT_DOCTOR_IMAGE =
    'https://images.unsplash.com/photo-1559839734-2b71f1e3c77d?q=80&w=150&auto=format&fit=crop';

const resolveDoctorImageUrl = async (doctorName, doctorImageUrl) => {
    if (doctorImageUrl) return doctorImageUrl;
    const doctor = await Doctor.findOne({ name: doctorName });
    return doctor?.imageUrl || DEFAULT_DOCTOR_IMAGE;
};

const isTimePast = (dateStr, timeStr) => {
    const now = new Date();
    // Local-aware date string (YYYY-MM-DD)
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;
    try {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        const appointmentTime = new Date();
        appointmentTime.setHours(hours, minutes, 0, 0);
        return now > appointmentTime;
    } catch (err) { return false; }
};

const timeToMinutes = (timeStr) => {
    try {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    } catch { return 0; }
};

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Fetch User Data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Fetch Nearest Upcoming Appointment
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        let appointments = await Appointment.find({
            userId,
            date: { $gte: today },
            status: { $in: ['Confirmed', 'Pending'] }
        });

        // Filter out appointments where time has passed today
        appointments = appointments.filter(appt => !isTimePast(appt.date, appt.time));

        // Manually sort
        appointments.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return timeToMinutes(a.time) - timeToMinutes(b.time);
        });

        const upcomingAppointment = appointments.length > 0 ? (typeof appointments[0].toObject === 'function' ? appointments[0].toObject() : { ...appointments[0] }) : null;

        // Resolve doctor image if missing
        if (upcomingAppointment && !upcomingAppointment.doctorImageUrl) {
            upcomingAppointment.doctorImageUrl = await resolveDoctorImageUrl(upcomingAppointment.doctorName, null);
        }

        // 3. Health Statistics from user document
        const statistics = [
            { id: 'heart_rate', label: 'Heart Rate', value: user.healthStats?.heartRate || '72', unit: 'BPM', trend: '+2%', status: 'up' },
            { id: 'bp', label: 'Blood Pressure', value: user.healthStats?.bp || '120/80', unit: 'mmHg', trend: '-1%', status: 'down' },
            { id: 'steps', label: 'Daily Steps', value: user.healthStats?.steps || '4,230', unit: 'steps', trend: '+15%', status: 'up' },
            { id: 'sleep', label: 'Sleep Quality', value: user.healthStats?.sleep || '7.5', unit: 'hrs', trend: '+0.5h', status: 'up' },
        ];

        // 4. Medication Info
        const medication = {
            name: user.medication?.name || 'Aspirin',
            dosage: user.medication?.dosage || '100mg',
            instruction: user.medication?.instruction || 'After breakfast',
            time: user.medication?.time || '08:00 AM'
        };

        // 5. Total Doctors Count
        const doctorsCount = await Doctor.countDocuments();

        res.status(200).json({
            user: {
                username: user.username,
                email: user.email
            },
            upcomingAppointment,
            statistics,
            medication,
            doctorsCount
        });
    } catch (error) {
        console.error('❌ DASHBOARD ERROR:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
