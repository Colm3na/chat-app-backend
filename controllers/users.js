const Models = require('../schemas');
const User = Models.User;

module.exports = {
    async getAllUsers(req, res, next) {
        try {
            const users = await User.find({})
            res.send(users.map( user => user.toObject() ));
        } catch(err) {
            return next(err);
        }
    },

    async getUser(req, res, next) {
        try {
            const user = await User.find({ _id: req.params.id })
            res.send(user);
        } catch(err) {
            return next(err);        
        }
    },

    async getUserByUsername(req, res, next) {
        try {
            const user = await User.find({ username: req.params.username })
            res.send(user);
        } catch(err) {
            return next(err);
        }
    }
};