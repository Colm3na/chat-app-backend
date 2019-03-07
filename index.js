require('dotenv').config();
const express = require('express');
const router = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.COOKIE_SECRET;
const app = express();

app.use(cookieParser(cookieSecret));
app.use(express.static(__dirname + 'public'))
app.use('/api/chatapp', router);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})