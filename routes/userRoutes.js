const express = require('express');
const router = express.Router();

const UserControl = require('../controllers/users');
const AuthHelper = require('../helpers/authHelper');

router.get('/users', AuthHelper.verifyToken ); // UserControl.getAllUsers

module.exports = router;