const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chatapp', { useNewUrlParser: true } );

const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: String,
    email: String,
    password: String
})

const User = mongoose.model('User', UserSchema);

module.exports = User;