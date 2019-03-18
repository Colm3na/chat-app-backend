const express = require('express');
const router = express.Router();
const MsgControl = require('../controllers/chatmessages');
const AuthHelper = require('../helpers/authHelper');

router.post('/chat-messages', AuthHelper.verifyToken, MsgControl.saveMessage);
router.get('/chat-messages/:id', AuthHelper.verifyToken, MsgControl.getMessage);
router.delete('/chat-messages', MsgControl.deleteAllMessages);

module.exports = router;