const Models = require('../schemas');
const Message = Models.Message;
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
                Message.create(message)
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
                    .json({ message: err.details });
            }
        }) 
    },

    async getMessage(req, res) {
        await Message.findOne({ _id: req.params.id }, ( err, messageFound ) => {
            if (!err) {
                res
                    .status(HttpStatus.OK)
                    .json({ message: 'Chat message', msg: messageFound.body })
            } else {
                res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Error occured', error: err })
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
                    .json({ message: 'Error occured', error: err })
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
                .json({ message: 'Error occured', error: err })
        }
    }
}