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
    async saveMessage(req, res, next) {
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
                        }
                    });
                    // save message id in receiver user model                    
                    User.findById( message.receiverId, (err, userFound) => {
                        if (!err) {
                            userFound.messages.received.push(message._id);
                            userFound.save();
                        }
                    });

                    res
                        .status(HttpStatus.CREATED)
                        .json({msg: 'Chat message succesfully saved', id: message._id, message});
                })
                .catch( err => {
                    return next(err);
                })
            } else {
                return next(err.details);
            }
        }) 
    },

    async getUserMessages(req, res, next) {
        try {
            await User.findById( req.params.senderId )
            .populate('messages.sent')
            .populate('messages.received')
            .then( user => {
                res
                    .status(HttpStatus.OK)
                    .json({messages: user.messages});
            })
        } catch(err) {
            return next(err);
        }
        
    },

    async get_user_number_unread_messages(req, res, next) {
        try {
            await User.findById( req.params.senderId )
            .populate({ path: 'messages.received', match: { isRead: false }, select: 'sender -_id' })
            .then( user => {
                res
                    .status(HttpStatus.OK)
                    .json({messages: user.messages.received});    
            })
        } catch(err) {
            return next(err);
        }
    },

    async set_message_as_read(req, res, next) {
        await Message.findById( req.params.messageId, (err, messageFound) => {
            if (!err) {
                if ( messageFound.isRead === false ) {
                    messageFound.isRead = true;
                    messageFound.save();
                    res
                        .status(HttpStatus.OK)
                        .json({ message: 'Message successfully set as read', msg: messageFound.isRead });
                } else {
                    res
                        .status(HttpStatus.CONFLICT)
                        .json({ message: 'Message has already been read' });
                }
            } else {
                return next(err);
            }
        })
    },

    async set_all_messages_as_read(req, res, next) {
        await Message.find( { receiverId: req.params.receiverId, senderId: req.params.senderId }, (err, messagesFound) => {
            if (!err) {
                messagesFound.forEach( messageFound => {
                    if ( messageFound.isRead === false ) {
                        messageFound.isRead = true;
                        messageFound.save();
                    }
                })
                res
                    .status(HttpStatus.OK)
                    .json({msg: 'All messages successfully set to read', messages: messagesFound});
            } else {
                return next(err);
            }
        })
    },

    async getMessage(req, res, next) {
        await Message.findById( req.params.id, ( err, messageFound ) => {
            if (!err) {
                res
                    .status(HttpStatus.OK)
                    .json({ message: 'Chat message', msg: messageFound.body });
            } else {
               return next(err);
            }
        })
    },

    async getAllMessages(req, res, next) {
        await Message.find({ senderId: req.params.senderId, receiverId: req.params.receiverId }, ( err, messages ) => {
            if(!err) {
                res
                    .status(HttpStatus.OK)
                    .json([ messages ]);
            } else {
                return next(err);
            }
        })
    },

    async deleteAllMessages(req, res, next) {
        try {
            await Message.deleteMany();
                res
                    .status(HttpStatus.OK)
                    .json({ message: 'All messages have been successfully deleted' });
        } catch (err) {
            return next(err);
        }
    }
}