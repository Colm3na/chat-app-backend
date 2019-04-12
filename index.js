require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.COOKIE_SECRET;
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const _ = require('lodash');

const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const chatmessages = require('./routes/chatmsgRoutes');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(cookieSecret));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
app.use(express.static(__dirname + 'public'))

app.use('/api/chatapp', users);
app.use('/api/chatapp', auth);
app.use('/api/chatapp', chatmessages);

// Not found
app.use((req, res, next) => {
  res.status(404).send({ msg: 'Url not found' });
})

// Error
app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Error occured', trace: err });
})

require('./socket/streams')(io, _);

http.listen(3000, () => {
    console.log('Server listening on port 3000');
})