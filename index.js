require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.COOKIE_SECRET;
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(cookieSecret));

require('./socket/streams')(io);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.static(__dirname + 'public'))

app.use('/api/chatapp', users);
app.use('/api/chatapp', auth);

http.listen(3000, () => {
    console.log('Server listening on port 3000');
})