const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StockSchema = new Schema({
    company_name: {type: String, required: true},
    ticker_symbol: {type: String, required: true},
    avg_buying_price: {type: Number, required: true},
    qty: {type: Number, required: true , min: 1}
});



module.exports = mongoose.model('Stock', StockSchema);