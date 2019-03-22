require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.COOKIE_SECRET;
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');
const dbConfig = require('./config/secrets');
const _ = require('lodash');

const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const chatmessages = require('./routes/chatmsgRoutes');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(cookieSecret));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
app.use(express.static(__dirname + 'public'))

app.use('/api/chatapp', users);
app.use('/api/chatapp', auth);
app.use('/api/chatapp', chatmessages);

io.use((socket, next) => {
  const token = socket.handshake.query.token;
 
  // verify token
  jwt.verify(token, dbConfig.secret, (err, decoded) => {
    if(err) return next(err);
    // set the user’s mongodb _id to the socket for future use
    socket._id = decoded.data._id;
    next();
  });
});

require('./socket/streams')(io);

http.listen(3000, () => {
    console.log('Server listening on port 3000');
})