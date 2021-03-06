const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//creating schema for clients
const WorkOrder = new Schema(
  {
    //cust information
    fname:
    {
      type: String,
      required: true
    },
    lname:
    {
      type: String,
      required: true
    },
    //vehicle information
    vehModel:
    {
      type: String,
      required: true
    },
    vehMake:
    {
      type: String,
      required: true
    },
    vehYear:
    {
      type: String,
      required: true
    },
    phoneNumber:
    {
      type: String,
      required: true
    },
    vehProblem:
    {
      type: String,
      required: true
    },
    //estimated price
    vehEstimate:
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
  mongoose.model('WorkOrder', WorkOrder)