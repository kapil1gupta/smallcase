var express = require('express');
var app = express();
var bodyParser = require('body-parser');
let trade = require('./routes/trade');
let stock = require('./routes/stock');

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://localhost:27017/smallcase';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));


app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
	res.header("Access-Control-Allow-Credentials", true);
	next();
});

let port = 3000;

app.use('/trade', trade);
app.use('/stocks', stock);


app.listen(port, function(){
  console.log(`Listening on port ${port}...`);
});