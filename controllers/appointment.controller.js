const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { createNotification } = require('./notification.controller');

const DEFAULT_DOCTOR_IMAGE =
    'https://images.unsplash.com/photo-1559839734-2b71f1e3c77d?q=80&w=150&auto=format&fit=crop';

const DOCTORS_SEED = [
    { name: 'Dr. Ahmed Raza', specialty: 'Cardiologist', imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Monday', time: '09:00' }, { day: 'Monday', time: '10:00' }, { day: 'Wednesday', time: '14:00' }] },
    { name: 'Dr. Sara Khan', specialty: 'Dermatologist', imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Tuesday', time: '11:00' }, { day: 'Thursday', time: '09:00' }] },
    { name: 'Dr. Usman Ali', specialty: 'Neurologist', imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Monday', time: '13:00' }, { day: 'Friday', time: '10:00' }] },
    { name: 'Dr. Nadia Siddiqui', specialty: 'Gynecologist', imageUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Wednesday', time: '09:00' }, { day: 'Friday', time: '14:00' }] },
    { name: 'Dr. Bilal Hassan', specialty: 'Orthopedic', imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Tuesday', time: '10:00' }, { day: 'Saturday', time: '09:00' }] },
    { name: 'Dr. Hina Malik', specialty: 'Pediatrician', imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Monday', time: '15:00' }, { day: 'Thursday', time: '11:00' }] },
    { name: 'Dr. Faisal Qureshi', specialty: 'General Physician', imageUrl: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Monday', time: '08:00' }, { day: 'Tuesday', time: '08:00' }, { day: 'Wednesday', time: '08:00' }] },
    { name: 'Dr. Zainab Abidi', specialty: 'Optometrist', imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Monday', time: '11:00' }, { day: 'Wednesday', time: '11:00' }] },
    { name: 'Dr. Kamran Akmal', specialty: 'Dentist', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Tuesday', time: '02:00' }, { day: 'Thursday', time: '02:00' }] },
    { name: 'Dr. Maria B', specialty: 'Psychiatrist', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Wednesday', time: '03:00' }, { day: 'Friday', time: '03:00' }] },
    { name: 'Dr. Omer Saeed', specialty: 'Radiologist', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Monday', time: '10:00' }, { day: 'Wednesday', time: '10:00' }] },
    { name: 'Dr. Fatima Jinnah', specialty: 'Oncologist', imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop&crop=faces', availableSlots: [{ day: 'Tuesday', time: '09:00' }, { day: 'Friday', time: '09:00' }] },
];

const seedDoctors = async () => {
    try {
        const count = await Doctor.countDocuments();
        if (count === 0) {
            await Doctor.insertMany(DOCTORS_SEED);
            console.log('✅ Doctors seeded successfully');
        }
    } catch (err) {
        console.error('Seed Doctors Error:', err);
    }
};

const resolveDoctorImageUrl = async (doctorName, doctorImageUrl) => {
    if (doctorImageUrl) return doctorImageUrl;
    const doctor = await Doctor.findOne({ name: doctorName });
    return doctor?.imageUrl || DEFAULT_DOCTOR_IMAGE;
};

const isActiveStatusFilter = { $nin: ['Cancelled'] };

/**
 * Helper to check if an appointment time has already passed.
 * @param {string} dateStr - YYYY-MM-DD
 * @param {string} timeStr - HH:MM AM/PM
 */
const isTimePast = (dateStr, timeStr) => {
    const now = new Date();
    // Local-aware date string (YYYY-MM-DD)
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;

    // If same day, check time
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
    } catch (err) {
        console.error('Error parsing time in isTimePast:', err);
        return false;
    }
};

/**
 * Helper to convert "HH:MM AM/PM" to minutes from midnight for sorting.
 */
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

const resolveDoctorImages = async (appointments) => {
    try {
        if (!appointments || appointments.length === 0) return appointments;

        // Get unique doctor names that don't have images yet
        const doctorNames = [...new Set(appointments
            .filter(a => !a.doctorImageUrl)
            .map(a => a.doctorName))];

        if (doctorNames.length === 0) return appointments;

        // Bulk fetch doctors
        const doctors = await Doctor.find({ name: { $in: doctorNames } }).select('name imageUrl');
        const doctorMap = doctors.reduce((acc, doc) => {
            acc[doc.name] = doc.imageUrl;
            return acc;
        }, {});

        // Map images back to appointments
        return appointments.map(appt => {
            const apptObj = typeof appt.toObject === 'function' ? appt.toObject() : { ...appt };
            if (!apptObj.doctorImageUrl && doctorMap[apptObj.doctorName]) {
                apptObj.doctorImageUrl = doctorMap[apptObj.doctorName];
            }
            // Fallback for missing image
            if (!apptObj.doctorImageUrl) {
                apptObj.doctorImageUrl = DEFAULT_DOCTOR_IMAGE;
            }
            return apptObj;
        });
    } catch (err) {
        console.error('Error resolving doctor images bulk:', err);
        return appointments;
    }
};

// GET /api/appointments/doctors
exports.getDoctors = async (req, res) => {
    try {
        await seedDoctors();
        const doctors = await Doctor.find({});
        return res.json({ doctors });
    } catch (error) {
        console.error('GET DOCTORS ERROR:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// POST /api/appointments/book
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorName, specialty, date, time, doctorImageUrl } = req.body;
        const userId = req.userId;

        if (!doctorName || !date || !time) {
            return res.status(400).json({ message: 'Doctor, date, and time are required' });
        }

        const clash = await Appointment.findOne({
            doctorName,
            date,
            time,
            status: isActiveStatusFilter,
        });
        if (clash) {
            return res.status(409).json({ message: 'Slot unavailable. This time slot is already booked.' });
        }

        const userClash = await Appointment.findOne({
            userId,
            date,
            time,
            status: isActiveStatusFilter,
        });
        if (userClash) {
            return res.status(409).json({ message: 'You already have an appointment at this date and time.' });
        }

        const finalImageUrl = await resolveDoctorImageUrl(doctorName, doctorImageUrl);
        const appointment = await Appointment.create({
            userId,
            doctorName,
            specialty: specialty || 'General',
            doctorImageUrl: finalImageUrl,
            date,
            time,
            status: 'Confirmed',
        });

        await createNotification(
            userId,
            'Appointment Booked',
            `Your appointment with ${doctorName} is confirmed for ${date} at ${time}.`,
            'appointment'
        );

        return res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error('BOOK APPOINTMENT ERROR:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// PUT /api/appointments/:id/reschedule
exports.rescheduleAppointment = async (req, res) => {
    try {
        const { doctorName, specialty, date, time, doctorImageUrl } = req.body;
        const userId = req.userId;
        const appointmentId = req.params.id;

        if (!doctorName || !date || !time) {
            return res.status(400).json({ message: 'Doctor, date, and time are required' });
        }

        const currentAppointment = await Appointment.findOne({ _id: appointmentId, userId });
        if (!currentAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const clash = await Appointment.findOne({
            _id: { $ne: appointmentId },
            doctorName,
            date,
            time,
            status: isActiveStatusFilter,
        });
        if (clash) {
            return res.status(409).json({ message: 'Slot unavailable. This time slot is already booked.' });
        }

        const userClash = await Appointment.findOne({
            _id: { $ne: appointmentId },
            userId,
            date,
            time,
            status: isActiveStatusFilter,
        });
        if (userClash) {
            return res.status(409).json({ message: 'You already have an appointment at this date and time.' });
        }

        currentAppointment.doctorName = doctorName;
        currentAppointment.specialty = specialty || currentAppointment.specialty || 'General';
        currentAppointment.date = date;
        currentAppointment.time = time;
        currentAppointment.doctorImageUrl = await resolveDoctorImageUrl(doctorName, doctorImageUrl);
        currentAppointment.status = 'Confirmed';
        await currentAppointment.save();

        await createNotification(
            userId,
            'Appointment Rescheduled',
            `Your appointment has been moved to ${date} at ${time} with ${doctorName}.`,
            'appointment'
        );

        return res.json({ message: 'Appointment rescheduled successfully', appointment: currentAppointment });
    } catch (error) {
        console.error('RESCHEDULE APPOINTMENT ERROR:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// GET /api/appointments/upcoming
exports.getUpcoming = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const appointments = await Appointment.find({
            userId: req.userId,
            date: { $gte: today },
            status: isActiveStatusFilter,
        });

        const resolved = await resolveDoctorImages(appointments);

        // Filter out appointments where time has passed today
        const filtered = resolved.filter(appt => !isTimePast(appt.date, appt.time));

        // Accurate Chronological Sort
        filtered.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return timeToMinutes(a.time) - timeToMinutes(b.time);
        });

        return res.json({ appointments: filtered });
    } catch (error) {
        console.error('GET UPCOMING ERROR:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// GET /api/appointments/history
exports.getHistory = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            userId: req.userId,
            status: { $in: ['Confirmed', 'Cancelled', 'Completed'] }, // Include all for history check
        }).sort({ date: -1, time: -1 });

        const resolved = await resolveDoctorImages(appointments);

        const history = resolved.filter(appt => {
            if (appt.status === 'Cancelled' || appt.status === 'Completed') return true;
            return isTimePast(appt.date, appt.time);
        }).map(appt => {
            if (appt.status === 'Confirmed') {
                appt.status = 'Completed';
            }
            return appt;
        });

        // Current to Oldest
        history.sort((a, b) => {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return timeToMinutes(b.time) - timeToMinutes(a.time);
        });

        return res.json({ appointments: history });
    } catch (error) {
        console.error('GET HISTORY ERROR:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// PUT /api/appointments/:id/cancel
exports.cancelAppointment = async (req, res) => {
    try {
        const appt = await Appointment.findOne({ _id: req.params.id, userId: req.userId });
        if (!appt) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appt.status = 'Cancelled';
        await appt.save();
        await createNotification(
            req.userId,
            'Appointment Cancelled',
            `Your appointment with ${appt.doctorName} on ${appt.date} has been cancelled.`,
            'appointment'
        );

        return res.json({ message: 'Appointment cancelled', appointment: appt });
    } catch (error) {
        console.error('CANCEL APPOINTMENT ERROR:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// GET /api/appointments/all
exports.getAll = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.userId });
        const resolved = await resolveDoctorImages(appointments);

        const updated = resolved.map((appt) => {
            if (appt.status === 'Confirmed' && isTimePast(appt.date, appt.time)) {
                appt.status = 'Completed';
            }
            return appt;
        });

        updated.sort((a, b) => {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return timeToMinutes(b.time) - timeToMinutes(a.time);
        });

        return res.json({ appointments: updated });
    } catch (error) {
        console.error('GET ALL APPOINTMENTS ERROR:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
