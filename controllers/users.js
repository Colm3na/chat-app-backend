const Models = require('../schemas');
const User = Models.User;
const HttpStatus = require('http-status-codes');

module.exports = {
    async getAllUsers(req, res) {
        await User.find({})
            .then( users => {
                res.status(HttpStatus.OK).json({ message: 'All users', users });
            })
            .catch(err => {
                res
                    .status(httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Error occured' });
              });
    },

    async getUser(req, res) {
        await User.find({ _id: req.params.id })
            .then( user => {
                res.status(HttpStatus.OK).json({ message: 'User', user });
            })
            .catch( err => {
                res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Error occured' });
              });
    },

    async getUserByUsername(req, res) {
        await User.find({ username: req.params.username })
            .then( user => {
                res.status(HttpStatus.OK).json({ message: 'User', user });
            })
            .catch( err => {
                res
                    .status(httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Error occured' });
            })
    }
};