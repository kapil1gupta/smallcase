const express = require('express');
const router = express.Router();
const Stocks = require('../controllers/stock');

let stock = new Stocks();

router.get('/', stock.fetchStocks); // fetch all the stocks data from stock collection
router.get('/retuns', stock.getreturns); //calculate the cumulative returns at any point of time of a particular portfolio


module.exports = router;