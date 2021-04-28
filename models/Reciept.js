const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//creating schema for clients
const Reciept = new Schema(
  {
    //cust information
    name:
    {
      type: String,
      required: true
    },
    //vehicle information
    model:
    {
      type: String,
      required: true
    },
    make:
    {
      type: String,
      required: true
    },
    phoneNumber:
    {
      type: String,
      required: true
    },
    problems:
    {
      type: String,
      required: true
    },
    parts:
    {
      type: String,
      required: true
    },
    //service details
    hours:
    {
      type: String,
      required: true
    },
    cost:
    {
      type: Number,
      required: true
    },
    //simple timestamp
    dateEntered:
    {
      type: Date,
      default: Date.now
    }
  });
//setting model
mongoose.model('Reciept', Reciept)