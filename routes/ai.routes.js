const express = require('express');
const router = express.Router();
const { chatWithGemini } = require('../controllers/ai.controller');
const auth = require('../middleware/auth.middleware');

// @route   POST api/ai/chat
// @desc    Chat with Gemini AI
// @access  Private
router.post('/chat', auth, chatWithGemini);

module.exports = router;
