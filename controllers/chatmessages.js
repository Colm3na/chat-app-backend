const Models = require('../schemas');
const Message = Models.Message;
const User = Models.User;
const HttpStatus = require('http-status-codes');
const Joi = require('joi');

const MessageValidator = Joi.object().keys({
    body: Joi.string().required(),
    senderId: Joi.any().required(),
    receiverId: Joi.any().required(),
    sender: Joi.string().required(),
    receiver: Joi.string(),
    isRead: Joi.bool(),
    createdAt:  Joi.date()
})

module.exports = {
    async saveMessage(req, res) {
        let message = req.body;
        await Joi.validate(message, MessageValidator, (err) => {
            if (!err) {
                let promise = Message.create(message);
                promise.then( (message) => {
                    // save message id in sender user model                    
                    User.findById( message.senderId, (err, userFound) => {
                        if (!err) {
                            userFound.messages.sent.push(message._id);
                            userFound.save();
                            console.log('**** update user', userFound.username);
                        }
                    });
                    // save message id in receiver user model                    
                    User.findById( message.receiverId, (err, userFound) => {
                        if (!err) {
                            userFound.messages.received.push(message._id);
                            userFound.save();
                            console.log('**** update user', userFound.username);
                        }
                    })
                })
                .then( () => {
                    res
                        .status(HttpStatus.CREATED)
                        .json({message: 'Chat message succesfully saved', message})
                })
                .catch( err => {
                    console.error(err);
                })
            } else {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json({ message: 'Error occured', err: err.details });
            }
        }) 
    },

    async getUserMessages(req, res) {
        await User.findById( req.params.senderId )
        .populate('messages.sent')
        .populate('messages.received')
        .then( user => {
            res
                .status(HttpStatus.OK)
                .json({messages: user.messages});
        })
        .catch( err => {
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error occured', error: err.details });
        })
    },

    async get_user_number_unread_messages(req, res) {
        await User.findById( req.params.senderId )
        .populate({path: 'messages.received', match: { isRead: false }})
        .then( user => {
            res
                .status(HttpStatus.OK)
                .json({messages: user.messages.received.length});    
        })
        .catch( err => {
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error occured', error: err.details });
        })
    },

    async set_message_as_read(req, res) {
        await Message.findById( req.params.messageId, (err, messageFound) => {
            if (!err) {
                if ( messageFound.isRead === false ) {
                    messageFound.isRead = true;
                    messageFound.save();
                    res
                        .status(HttpStatus.OK)
                        .json({ message: 'message successfully set as read', msg: messageFound.isRead })
                } else {
                    res
                        .json({ message: 'message has already been read' })
                }
            } else {
                res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Error occured', error: err.details })
            }
        })
    },

    async getMessage(req, res) {
        await Message.findById( req.params.id, ( err, messageFound ) => {
            if (!err) {
                res
                    .status(HttpStatus.OK)
                    .json({ message: 'Chat message', msg: messageFound.body })
            } else {
                res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Error occured', error: err.details })
            }
        })
    },

    async getAllMessages(req, res) {
        await Message.find({ senderId: req.params.senderId, receiverId: req.params.receiverId }, ( err, messages ) => {
            if(!err) {
                res
                    .status(HttpStatus.OK)
                    .json([ messages ])
            } else {
                res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Error occured', error: err.details })
            }
        })
    },

    async deleteAllMessages(req, res) {
        try {
        await Message.deleteMany();
            res
                .status(HttpStatus.OK)
                .json({ message: 'All messages have been successfully deleted' })
        } catch (err) {
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error occured', error: err.details })
        }
    }
}