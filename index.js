require('dotenv').config();
const express = require('express');
const router = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.COOKIE_SECRET;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(cookieSecret));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.static(__dirname + 'public'))
app.use('/api/chatapp', router);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})