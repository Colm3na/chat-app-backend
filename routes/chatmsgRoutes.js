const express = require('express');
const router = express.Router();
const MsgControl = require('../controllers/chatmessages');

router.post('/chat-messages', MsgControl.saveMessage);

router.get('/chat-messages/:id', MsgControl.getMessage);

module.exports = router;