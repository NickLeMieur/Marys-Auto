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

app.post('/order/submitWorkOrder', async (req, res) => {
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
  await WorkOrder(order).save().then(cOrder => {
    res.render('./order/submitWorkOrder', {
      fname: cOrder.fname,
      lname: cOrder.lname,
      vehModel: cOrder.vehModel,
      vehMake: cOrder.vehMake,
      vehYear: cOrder.vehYear,
      phoneNumber: cOrder.phoneNumber,
      vehProblem: cOrder.vehProblem,
      vehEstimate: cOrder.vehEstimate
    });
    console.log(cOrder);
    res.status(201);
  });

  return res.status(200);

});
app.get('/order/viewWorkOrders', async (req, res) => {
  //sorting newest to oldest
  await WorkOrder.find({}).sort({"dateEntered":-1}).lean().then(orders => {
    res.render('./order/viewWorkOrders', {
      orders: orders
    });
  });

});

app.post('/order/deleteWorkOrder', async (req, res) => {

  console.log(req.body.id);
  await WorkOrder.deleteOne({ _id: req.body.id }).then(del => {
    res.status(204);  //setting status to 204 (no content)
  });
});

app.post('/order/doWorkOrder', async (req, res) => {
  console.log(req.body);
  res.render('./order/doWorkOrder', {
    id: req.body.id
  });
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