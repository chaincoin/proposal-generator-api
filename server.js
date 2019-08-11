var express = require('express');
var bodyParser = require('body-parser');
var router = require('./router');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', router);

var port = process.env.PORT || 8080;

app.listen(port);
console.log('Magic happens on port ' + port);
