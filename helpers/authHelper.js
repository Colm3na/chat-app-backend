const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');

const dbConfig = require('../config/secrets');

module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.cookies.auth;

    if (!token) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ message: 'No token provided' });
    }

    return jwt.verify(token, dbConfig.secrets, (err, decoded) => {
      if (err) {
        if (err.expiredAt < new Date()) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Token has expired. Please login again',
            token: null
          });
        }
        next();
      }
      req.user = decoded.data;
      next();
    });
  }
};