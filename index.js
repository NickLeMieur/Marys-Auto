//package declarations
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { removeAllListeners } = require('nodemon');
//port declaration
const PORT = process.env.PORT || 1500;


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const dbUrl = "mongodb://127.0.0.1:27017";

const db = mongoose.connection;

mongoose.connect(dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  db.on('error', () => {
    console.error.bind(console, 'connection error: ');
  });
  db.once('open', () => {
    console.log('MongoDB Connected');
  });


  //ROUTES

  app.get('/', (req, res) =>{

    res.render('index');
  });



  //INIT SERVER

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  
  });