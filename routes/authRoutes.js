const express = require('express');
const User = require('../schemas');
const router = express.Router();
const AuthControl = require('../controllers/auth');

router.post('/register', AuthControl.createUser);

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