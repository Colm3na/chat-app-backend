const mongoose = require('mongoose');
const dbConfig = require('./config/secrets');

mongoose.connect(dbConfig.url, { useNewUrlParser: true } );

const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: String,
    email: String,
    password: String
})

const User = mongoose.model('User', UserSchema);

module.exports = User;