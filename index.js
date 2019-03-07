require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.COOKIE_SECRET;

const app = express();

app.use(cookieParser(cookieSecret));
app.use(express.static(__dirname + 'public'))

app.get('/', function (req, res) {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)
  })

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})