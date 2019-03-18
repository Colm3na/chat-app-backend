const Models = require('../schemas');
const Message = Models.Message;
const HttpStatus = require('http-status-codes');

module.exports = {
    async saveMessage(req, res) {
        let message = req.body;
        await Message.create(message)
            .then( () => {
                res
                    .status(HttpStatus.CREATED)
                    .json({message: 'Chat message succesfully saved', message})
            })
            .catch( err => {
                console.error(err);
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