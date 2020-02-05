const express = require('express');
const router = express.Router();
const Trades = require('../controllers/trade');

let trade = new Trades();

router.post('/buy', trade.buyTrade); // buying a trade
router.delete('/sell', trade.sellTrade); // seeling a trade
router.get('/:ticker_symbol', trade.fetchPortfolio); // get all the trades for respective stock


module.exports = router;