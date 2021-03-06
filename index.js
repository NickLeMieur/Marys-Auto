//package declarations
const handlebars = require('handlebars');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const insecureHandlebars = allowInsecurePrototypeAccess(handlebars);
const { removeAllListeners } = require('nodemon');
const helpers = require('handlebars-helpers');
const math = helpers.math();
//port declaration
const PORT = process.env.PORT || 1650;

handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));
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
require('./models/Reciept');
const Reciept = mongoose.model('Reciept');
const Both = mongoose.model('WorkOrder', 'Reciept');

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
  console.log("rec" + req.body.fname);
  var error = false;
  res.render('./order/submitWorkOrder', {
    fname: req.body.fname,
    lname: req.body.lname,
    vehModel: req.body.model,
    vehMake: req.body.make,
    vehYear: req.body.year,
    phoneNumber: req.body.phoneNumber,
    vehProblem: req.body.problems,
    cost: req.body.cost
  });
  return res.status(200);

});

app.get('/order/viewWorkOrders', async (req, res) => {
  //sorting newest to oldest
  await WorkOrder.find({}).sort({ "dateEntered": -1 }).lean().then(orders => {
    res.render('./order/viewWorkOrders', {
      orders: orders
    });
  });
});

app.get('/order/dailyProgress', async (req, res) => {

  await WorkOrder.find({}).lean().exec(function (err, orders) {
    Reciept.find({}).lean().exec(function (err, reciept) {
      res.render('./order/dailyProgress', {
        orders: orders.filter(function (myObj) {
          return myObj.dateEntered >= new Date().setHours(0, 0, 0, 0)
        }),
        reciept: reciept.filter(function (myObj) {
          return myObj.dateEntered >= new Date().setHours(0, 0, 0, 0)
        })
      }
      )

    });

  });
});

app.post('/order/completeWorkOrder', async (req, res) => {
  //console.log(req.body);

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
  var ord = await WorkOrder(order).save().then(cOrder => {

    console.log(cOrder);
    //res.render('../order/viewWorkOrders');
    res.redirect('../order/viewWorkOrders');
    return res.status(201);
  });


});
app.post('/order/deleteWorkOrder', async (req, res) => {

  console.log(req.body.id);
  await WorkOrder.deleteOne({ _id: req.body.id }).then(del => {
    res.status(204).redirect('../order/viewWorkOrders');  //setting status to 204 (no content)
  });
});



app.post('/order/doWorkOrder', async (req, res) => {

  console.log(req.body);
  var ord = await WorkOrder.findOne({ _id: req.body.id }).lean();
  //console.log(ord);
  //console.log(ord);
  const date = new Date(ord.dateEntered);
  console.log(date.toLocaleDateString());

  console.log(ord);
  //console.log(date.toString());
  res.render('./order/doWorkOrder', {
    id: req.body.id,
    fname: ord.fname,
    lname: ord.lname,
    phoneNumber: ord.phoneNumber,
    cost: ord.vehEstimate,
    make: ord.vehMake,
    model: ord.vehModel,
    year: ord.vehYear,
    problem: ord.vehProblem,
    date: date
  });
  //console.log(ord);
  return res.status(200);
});

app.post('/order/searchWorkOrder', async (req, res) => {

  query = req.body.query;
  console.log(query);

  if (req.body.query == "fname") {
    var orders = await WorkOrder.find({ fname: req.body.sch_param })
      .lean().catch((err) => { console.log(err) });
  }
  else if (req.body.query == "lname") {
    var orders = await WorkOrder.find({ lname: req.body.sch_param })
      .lean().catch((err) => { console.log(err) });
  }
  else if (req.body.query == "make") {
    var orders = await WorkOrder.find({ vehMake: req.body.sch_param })
      .lean().catch((err) => { console.log(err) });
  }
  else if (req.body.query == "model") {
    var orders = await WorkOrder.find({ vehModel: req.body.sch_param })
      .lean().catch((err) => { console.log(err) });
  }
  console.log(orders);
  res.render('./order/searchWorkOrder', {
    ord: orders
  });

  return res.status(200);
});

app.post('/order/completeReciept', async (req, res) => {


  var reciept = {
    name: req.body.name,
    make: req.body.make,
    model: req.body.model,
    cost: req.body.cost,
    year: req.body.year,
    hours: req.body.hours,
    parts: req.body.parts,
    problems: req.body.problems,
    phoneNumber: req.body.phoneNumber,
    expenses: req.body.expenses
  };
  console.log(reciept);

  var rec = await Reciept(reciept).save().then(print => {
    res.render('./order/completeReciept', {
      make: print.make,
      model: print.model,
      name: print.name,
      cost: print.cost,
      year: print.year,
      parts: print.parts,
      problems: print.problems,
      phoneNumber: print.phoneNumber,
      hours: print.hours
    });
  });

  console.log(rec);
  //res.render('./order/completeReciept');
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