const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const { getRecords, addRecord, deleteRecord, updateRecord } = require('../controllers/records.controller');

router.get('/', protect, getRecords);
router.post('/add', protect, addRecord);
router.put('/:id', protect, updateRecord);
router.delete('/:id', protect, deleteRecord);

module.exports = router;
