const User = require('../schemas');
const Joi = require('joi');

const UserValidator = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required()
})

module.exports = {
    createUser(req, res) {
        let user = req.body;
        console.log(user);
        Joi.validate( user, UserValidator, (err) => {
            if (!err) {
                User.create({user}, (err) => {
                    if (!err) {
                        console.log('user succesfully registered!');
                    }
                })
            } else {
                console.error(err);
            }
        })
    }
};