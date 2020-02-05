const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TradeSchema = new Schema({
    user_id: {type: String, required: true},
    ticker_symbol: {type: String, required: true},
    buying_price: {type: Number, required: false},
    trade_type: {type: String, required: true, enum:["sell","buy"]},
    qty: {type: Number, required: true , min: 1},
    created_at: {type: Date, default: Date.now() }
});



module.exports = mongoose.model('Trade', TradeSchema);