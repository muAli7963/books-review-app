const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV)
const app = express();


mongoose.connect('mongodb+srv://mydb:mydb123456@cluster0.0wha1.mongodb.net/mydb?retryWrites=true&w=majority', {useNewUrlParser: true});

const {User} = require('./models/user');
const {Book} = require('./models/book');

app.use(bodyParser.json());
app.use(cookieParser());






const port = process.env.PORT || 3001;

app.listen(port , ()=> {
  console.log('SERVER IS RUNNING')
})
