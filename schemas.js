const mongoose = require('mongoose');
const dbConfig = require('./config/secrets');

mongoose.connect(dbConfig.url, { useNewUrlParser: true } );

const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now() }
})

const User = mongoose.model('User', UserSchema);

const MessageSchema = new Schema ({
    body: { type: String, default: '' },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    sender: String,
    receiver: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() }
})

const Message = mongoose.model('Message', MessageSchema);

module.exports = { User, Message };
