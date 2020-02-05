const Trade = require('../models/trade');
const Stocks = require('../controllers/stock');

let stock = new Stocks();

class Trades {
    
    constructor(){

    }

    /** 
     * buying a Trade
     inserting new documnet in trade collection and update the qty and average buying price in stock collection 
     if something failed while updating in stock collection then it will delete respective document from trade collection as well.
    */ 
    buyTrade(req,res) {

        if(!req.body.buyingPrice){
            let resJson = {
                "http" : 400,
                "message" : "Bad request!!!"
            }
            return res.send(resJson)
        }

        let trade = new Trade(
            {
                user_id: req.body.userId,
                ticker_symbol: req.body.tickerSymbol,
                buying_price: req.body.buyingPrice,
                trade_type : "buy",
                qty: req.body.qty
            }
        );
        
        trade.save(async function (err,trade) {
            if (err) {
                let resJson = {
                    "http" : 500,
                    "message" : "Internal server error, please retry again!!!"
                }
                res.send(resJson);
            }
            let stocksData = await stock.getStock(trade.ticker_symbol);
            let newStockData = await stock.getUpdatedStockDoc(req.body,stocksData,trade.trade_type);
            let modifyStockResult = await stock.updateStock(trade.ticker_symbol,newStockData);
            if(!modifyStockResult.nModified){
                let deletedStocksData = await (new Trades()).deleteTrade(trade._id);
                let resJson = {
                    "http" : 500,
                    "message" : "Internal server error, Please try again!!!!"
                }
                res.send(resJson);
            }
            else{
                let resJson = {
                    "http" : 200,
                    "message" : "Trade Created successfully!!!!"
                }
                res.send(resJson)
            }
        })
    };
    
    /** 
     * selling a trade
     inserting new documnet in trade collection and update the qty in stock collection 
     if something failed while updating in stock collection then it will delete respective document from trade collection as well.
     if selling stock is greater than stock qty then it will delete respective document from trade collection as well.
     */

    sellTrade(req,res){

        let trade = new Trade(
            {
                user_id: req.body.userId,
                ticker_symbol: req.body.tickerSymbol,
                trade_type : "sell",
                qty: req.body.qty
            }
        );

        trade.save(async function (err,trade) {
            if (err) {
                let resJson = {
                    "http" : 500,
                    "message" : "Internal server error, please retry again!!!"
                }
                res.send(resJson);
            }
            let stocksData = await stock.getStock(trade.ticker_symbol);
            if(stocksData.qty < trade.qty){
                let deletedStocksData = await (new Trades()).deleteTrade(trade._id);
                let resJson = {
                    "http" : 400,
                    "message" : "Bad request,Qty is grater than Existing Stock Qty!!!"
                }
                res.send(resJson);
            }
            else{
                let newStockData = await stock.getUpdatedStockDoc(req.body,stocksData,trade.trade_type);
                let modifyStockResult = await stock.updateStock(trade.ticker_symbol,newStockData);
                if(!modifyStockResult.nModified){
                    let deletedStocksData = await (new Trades()).deleteTrade(trade._id);
                    let resJson = {
                        "http" : 500,
                        "message" : "Internal server error, Please try again!!!!"
                    }
                    res.send(resJson);
                }
                else{
                    let resJson = {
                        "http" : 200,
                        "message" : "Trade Created successfully!!!!"
                    }
                    res.send(resJson)
                }
            }
        })
    }

    // get all the trades for respective stock

    async fetchPortfolio(req,res){
        let stockdata = await stock.getStock(req.params.ticker_symbol,{"_id":0,"__v":0});
        let tradeData = await (new Trades()).getTrade(req.params.ticker_symbol,{"_id":0,"user_id":0,"__v":0});
        stockdata["history"] = tradeData;
        let resJson = {
            "http" : 200,
            "message" : stockdata
        }
        res.send(resJson)
    }

    // getting trade from trade collection

    getTrade(ticker_symbol,projection) {
        let promise = new Promise((resolve,reject)=>{
            Trade.find({"ticker_symbol":ticker_symbol},projection, function (err, tradeData) {
                if (err){
                    reject(err);
                }
                resolve(tradeData);
            })
        })
        return promise;
    }

    // deleting a trade from trade collection

    deleteTrade(tradeId){

        let promise = new Promise((resolve,reject)=>{
            Trade.findByIdAndRemove({"_id" : tradeId}, function (err, stock) {
                if (err) {
                    reject(err);
                }
                resolve(stock);
            })
        })
       return promise;
    }
}

module.exports = Trades;


