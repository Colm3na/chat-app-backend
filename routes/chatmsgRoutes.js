const express = require('express');
const router = express.Router();
const MsgControl = require('../controllers/chatmessages');
const AuthHelper = require('../helpers/authHelper');

router.get('/chat-messages/:senderId/unread', AuthHelper.verifyToken, MsgControl.get_user_number_unread_messages);
router.get('/chat-messages/:messageId/read', AuthHelper.verifyToken, MsgControl.set_message_as_read);
router.get('/chat-messages/:receiverId/:senderId/read', AuthHelper.verifyToken, MsgControl.set_all_messages_as_read);
router.post('/chat-messages/:senderId/:receiverId', AuthHelper.verifyToken, MsgControl.saveMessage);
router.get('/chat-messages/:senderId/:receiverId', AuthHelper.verifyToken, MsgControl.getAllMessages);
router.get('/chat-messages/:senderId', AuthHelper.verifyToken, MsgControl.getUserMessages);
router.get('/chat-messages/:id', AuthHelper.verifyToken, MsgControl.getMessage);
router.delete('/chat-messages', MsgControl.deleteAllMessages);

module.exports = router;