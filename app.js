var express = require('express');
var app = express();
var push = require('./push');
var bus = new(require('events').EventEmitter)();

app.use(express.bodyParser());

app.post("/notifications", function(req, res){
  bus.emit('notification', req.body);
  res.send('ok');
});

var port = 3000;

app.listen(port, function(){
  console.log('Listening on port ' + port);
});

bus.on('notification', function(data){
  push.send(data);
});
