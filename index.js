require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.COOKIE_SECRET;
const User = require('./schemas');
const app = express();

app.use(cookieParser(cookieSecret));
app.use(express.static(__dirname + 'public'))

app.get('/', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
})

app.get('/users', function(req, res) {
  User.find({}, (err, users) => {
    if ( users.length === 0 ) {
      console.log('no users found');
    } else {
      console.log(users);
    }
  });
})

app.post('/users', function(req, res) {
  User.create({username:'Pepo', email:'1@2.at', password:'pass'}, (err) => {
    if (!err) {
      console.log('user successfully created');
    }
  });
})

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})