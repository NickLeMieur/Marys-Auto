//package declarations
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { removeAllListeners } = require('nodemon');
//port declaration
const PORT = process.env.PORT || 1650;

const orders = require('./routes/order');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


//THIS IS REQUIRED FOR RES.BODY OPERATIONS
//it converts the req.body to a desrialized 
//json object for app use
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(express.json()); //Used to parse JSON bodies


//database operations

const dbUrl = "mongodb+srv://admin:Password1@cluster.qtabs.mongodb.net/MarysAuto?retryWrites=true&w=majority";

const db = mongoose.connection;
require('./models/WorkOrder');
const WorkOrder = mongoose.model('WorkOrder');

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

app.get('/', (req, res) => {

  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about')
});

app.post('/order/submitWorkOrder', async (req,res) =>{
  //res.render('/submitWorkOrder');
  console.log(req.body);
  var error = false;
    
  const order = {
    fname: req.body.fname,
    lname: req.body.lname,
    vehModel: req.body.model,
    vehMake: req.body.make,
    vehYear: req.body.year,
    phoneNumber: req.body.phoneNumber,
    vehProblem: req.body.problems,
    vehEstimate: req.body.cost
  }
  await WorkOrder(order).save().then(cOrder =>{
    console.log(cOrder);
    res.status(201);
  });

  res.render('./order/submitWorkOrder');
  return res.status(200);

});

app.use('/order', orders);




//PAGE NOT FOUND ROUTE
app.get('*', (req, res) => {
  res.status(404).send(
    "404 Page Not Found! <a href='/'>Click to return to main</a><footer></footer>"
  );
});


//INIT SERVER

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);

});