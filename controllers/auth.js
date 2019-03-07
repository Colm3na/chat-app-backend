const User = require('../schemas');
const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secrets');

const UserValidator = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(4).required()
})

module.exports = {
    createUser(req, res) {
        let user = req.body;
        console.log(user);
        Joi.validate( user, UserValidator, (err) => {
            if (!err) {

                //Check if an user with the same username or e-mail already exists
                let username = user.username;
                let email = user.email;

                User.findOne({username}, (err, userFound) => {
                    if ( userFound !== null ) {
                        res
                        .status(HttpStatus.CONFLICT)
                        .json({ message: 'an user with the same username already exists!', userFound })
                        return;
                    } else {
                        User.findOne({email}, (err, userFound) => {
                            if ( userFound !== null ) {
                                res
                                        .status(HttpStatus.CONFLICT)
                                        .json({ message: 'an user with the same e-mail already exists!', userFound })
                                return;
                            }
                            
                            //Hash user's password to store it safely
                            let password = user.password;

                            bcrypt.hash(password, 10, (err, hash) => {
                                password = hash;
                                user.password = password;

                                // Create user in DB
                                User.create(user)
                                    .then( user => {
                                        const token = jwt.sign({data: user}, dbConfig.secret, {
                                            expiresIn: 120
                                        });
                                        res.cookie('auth', token);
                                        res
                                            .status(HttpStatus.CREATED)
                                            .json({ message: 'user successfully created', user, token })
                                    })
                                    .catch(err => {
                                        res
                                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                            .json({message: 'an error occured while saving user to DB', err})
                                    })
                            }) 
                        })
                    }
                })
            } else if (err && err.details) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: err.details });
            } else {
                console.error(err);
            }
        })
    }
};