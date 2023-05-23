const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

mongoose.connect('mongodb+srv://dan_evan:BfcBjU7fCjY3nIn0@cluster0.pkc2ray.mongodb.net/myMessages?retryWrites=true&w=majority')
  .then( resp => {
    console.log('MongoDb Connected! ')
  })
  .catch(err => {
    console.log('MongoDb Connection Failed! ', err)
  })
// BfcBjU7fCjY3nIn0


app.use('/images', express.static(path.join(__dirname, 'images'))) // This allow to access the images folder without 
// cross origin limitations. Especially when I want to render the image somewhere
app.use(bodyParser.json());



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Origin, Authorization');
  next();

})

app.use('/api/auth', authRoutes)
app.use(postsRoutes)


module.exports = app;
