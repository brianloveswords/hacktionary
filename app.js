var express = require('express')
  , fs = require('fs')
  , path = require('path');

var app = express.createServer();

var elements = JSON.parse(fs.readFileSync('./elements.json'));

app.use(express.static(path.join(__dirname, "static")));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/term/html/:element', function (req, res) {
  var thing = elements[req.param('element')]
  res.contentType('json');
  if (thing) {
    res.send({definition: thing}, 200);
  } else {
    res.send({definition: 'not found'}, 404);
  }
});

module.exports = app;
