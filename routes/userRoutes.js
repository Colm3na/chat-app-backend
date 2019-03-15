const express = require('express');
const router = express.Router();

const UserControl = require('../controllers/users');
const AuthHelper = require('../helpers/authHelper');

router.get('/users', AuthHelper.verifyToken, UserControl.getAllUsers);
router.get('/user/:id', AuthHelper.verifyToken, UserControl.getUser); 
router.get('/username/:username', AuthHelper.verifyToken, UserControl.getUser); 

module.exports = router;