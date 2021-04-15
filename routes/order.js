const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

   router.get('/', (req, res) => {
        res.render('order/index')
  });
  
  router.get('/add', (req, res) => {
    res.render('order/add');
    
  });

  router.get('/submitWorkOrder', (req, res) => {
    res.render('order/submitWorkOrder');
    
  });

  module.exports = router;