// controllers/records.controller.js
const MedicalRecord = require('../models/MedicalRecord');
const { createNotification } = require('./notification.controller');

// GET /api/records
exports.getRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ records });
    } catch (error) {
        console.error('❌ GET RECORDS ERROR:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// POST /api/records/add
exports.addRecord = async (req, res) => {
    try {
        const { title, description, fileUrl, recordType } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        console.log('📝 Saving New Record:', { userId: req.userId, title, recordType });

        const record = await MedicalRecord.create({
            userId: req.userId,
            title,
            description: description || '',
            fileUrl: fileUrl || '',
            recordType: recordType || 'Other',
        });

        await createNotification(
            req.userId,
            'New Medical Record',
            `A new ${recordType || 'document'} "${title}" has been added to your records.`,
            'record'
        );

        res.status(201).json({ message: 'Medical record added successfully', record });
    } catch (error) {
        console.error('❌ ADD RECORD ERROR:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// DELETE /api/records/:id
exports.deleteRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findOne({ _id: req.params.id, userId: req.userId });
        if (!record) return res.status(404).json({ message: 'Record not found' });
        await record.deleteOne();
        res.json({ message: 'Record deleted' });
    } catch (error) {
        console.error('❌ DELETE RECORD ERROR:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// PUT /api/records/:id
exports.updateRecord = async (req, res) => {
    try {
        const { title, description, fileUrl, recordType } = req.body;
        const record = await MedicalRecord.findOne({ _id: req.params.id, userId: req.userId });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        record.title = title || record.title;
        record.description = description !== undefined ? description : record.description;
        record.fileUrl = fileUrl || record.fileUrl;
        record.recordType = recordType || record.recordType;

        await record.save();

        await createNotification(
            req.userId,
            'Medical Record Updated',
            `Your record "${record.title}" has been updated.`,
            'record'
        );

        res.json({ message: 'Medical record updated successfully', record });
    } catch (error) {
        console.error('❌ UPDATE RECORD ERROR:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
