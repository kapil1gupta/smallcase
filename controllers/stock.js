const Stock = require('../models/stock');

class Stocks {
    
    constructor(){

    }

    // get a single stock data from stock collection
    getStock(ticker_symbol,projection){
        let promise = new Promise((resolve,reject)=>{
            Stock.findOne({"ticker_symbol" : ticker_symbol},projection).lean().exec(function (err, stock) {
                if (err) {
                    reject(err);
                }
                resolve(stock);
            })
        })
       return promise;
    }

    // fetch all the stocks data from stock collection
    async fetchStocks(req,res){

        let stockData = await (new Stocks()).getStocks();
        let resJson = {
            "http" : 200,
            "message" : stockData
        }
        res.send(resJson);
    }

    // fetch all the stocks data from stock collection
    getStocks(){

        let promise = new Promise((resolve,reject)=>{
            Stock.find({},{"_id":0,"_v":0}).lean().exec(function (err, stock) {
                if (err) {
                    reject(err);
                }
                resolve(stock);
            })
        })
        return promise;
       
    }

    // update a stock while buying and selling trade
    updateStock(ticker_symbol,doc){

        let promise = new Promise((resolve,reject)=>{

            Stock.updateOne({"ticker_symbol" : ticker_symbol},{$set: doc}, function (err, stock) {
                if (err) {
                    reject(err);
                }
                resolve(stock);
            })
        })
        return promise;
    }

    // calculate average buying price and qty in a trade
    getUpdatedStockDoc(reqData, stockRes, tradeType){
        if(tradeType == "buy"){
            let buyingPrice = reqData.buyingPrice;
            let qty = reqData.qty;
            let averageBuyingPrice = stockRes.avg_buying_price;
            let stockQty = stockRes.qty;
            let newAverageBuyingPrice = ((averageBuyingPrice * stockQty) + (buyingPrice * qty)) / (qty + stockQty); 
            stockRes.avg_buying_price = newAverageBuyingPrice;
            stockRes.qty = stockRes.qty + reqData.qty;
            return stockRes;
        }
        else{
            stockRes.qty = stockRes.qty - reqData.qty;
            return stockRes;
        }
        
    }

    // calculate the cumulative returns at any point of time of a particular portfolio
    async getreturns(req,res){
        let stockData = await (new Stocks()).getStocks();
        let retruns = 0;
        stockData.forEach(element => {
            let price = (100 - element.avg_buying_price) * element.qty;
            retruns = retruns + price;
        });
        let resJson = {
            "http" : 200,
            "message" : retruns
        }
        res.send(resJson);
    }

}

module.exports = Stocks;