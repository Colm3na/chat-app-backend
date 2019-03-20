const Models = require('../schemas');
const User = Models.User;
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

const UserLoginUsernameValidator = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(4).required()
})

const UserLoginEmailValidator = Joi.object().keys({
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
                                            expiresIn: '5h'
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
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: err.details });
            }
        })
    },

    validateUser(req, res) {
        let user = req.body;
        console.log(user);
        if (user.username) {
            Joi.validate( user, UserLoginUsernameValidator, (err) => {
                if (!err) {

                    let username = user.username;

                    // Look for the user in the DB
                    User.findOne({username}, (err, userFound) => {
                        if ( userFound === null ) {
                            res
                                .status(HttpStatus.CONFLICT)
                                .json({ message: 'wrong username', userFound })
                            return;
                        } else {

                            let password = user.password;

                            // Compare login password and the one stored in the DB
                            bcrypt.compare(password, userFound.password, (err, correct) => {

                                if ( correct === true ) {
                                    user.password = userFound.password;
                                    user._id = userFound._id;
                                    const token = jwt.sign({data: user}, dbConfig.secret, {
                                        expiresIn: '5h'
                                    });
                                    res
                                        .cookie('auth', token)
                                        .status(HttpStatus.OK)
                                        .json({message: 'user successfully logged in', user, token})
                                } else {
                                    res
                                        .status(HttpStatus.CONFLICT)
                                        .json({message: 'invalid password', user})
                                }
                            })
                        }
                    })
                } else {
                    return res.status(HttpStatus.BAD_REQUEST).json({ message: err.details });
                }
            })
        } else {
            Joi.validate( user, UserLoginEmailValidator, (err) => {
                if (!err) {

                    let email = user.email;

                    // Look for the user in the DB
                    User.findOne({email}, (err, userFound) => {
                        if ( userFound === null ) {
                            res
                                .status(HttpStatus.CONFLICT)
                                .json({ message: 'wrong email', userFound })
                            return;
                        } else {

                            let password = user.password;

                            // Compare login password and the one stored in the DB
                            bcrypt.compare(password, userFound.password, (err, correct) => {

                                if ( correct === true ) {
                                    user.password = userFound.password;
                                    user._id = userFound._id;
                                    const token = jwt.sign({data: user}, dbConfig.secret, {
                                        expiresIn: '5h'
                                    });
                                    res
                                        .cookie('auth', token)
                                        .status(HttpStatus.OK)
                                        .json({message: 'user successfully logged in', user, token})
                                } else {
                                    res
                                        .status(HttpStatus.CONFLICT)
                                        .json({message: 'invalid password', user})
                                }
                            })
                        }
                    })
                } else {
                    return res.status(HttpStatus.BAD_REQUEST).json({ message: err.details });
                }
            })
        }
    }
};