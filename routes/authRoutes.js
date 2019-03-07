const express = require('express');
const User = require('../schemas');
const router = express.Router();

router.get('/', function(req, res) {
    User.find({}, (err, users) => {
        if ( users.length === 0 ) {
        console.log('no users found');
        } else {
        console.log(users);
        }
    });
})

router.post('/', function(req, res) {
    User.create({username:'Pepo', email:'1@2.at', password:'pass'}, (err) => {
        if (!err) {
        console.log('user successfully created');
        }
    });
})

module.exports = router;