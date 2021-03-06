const express = require('express');
const Models = require('../schemas');
const User = Models.User;
const router = express.Router();
const AuthControl = require('../controllers/auth');

router.post('/register', AuthControl.createUser);

router.post('/login', AuthControl.validateUser);

router.get('/users', function(req, res) {
    User.find({}, (err, users) => {
        if ( users.length === 0 ) {
        console.log('no users found');
        } else {
        console.log(users);
        }
    });
})

module.exports = router;