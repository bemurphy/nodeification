var express = require('express');
var app = express();
var push = require('./push');
var bus = new(require('events').EventEmitter)();
var Message = require("./message");
var db = require('nano')('http://localhost:5984/notifications');
var User = require('./user');
var u = require('underscore');

app.use(express.bodyParser());
// TODO use nginx for prod
app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get("/", function(req, res) {
  var id = '82d362f0e9c65a9cb64319aeb209b970';

  db.get(id, function(err, doc){
    var user = new User(doc);
    db.view('notifications', 'namespace_events', function(err, body){

      res.render('index', {
        title: 'Subscriptions',
        user: user,
        rows: u.map(body.rows, function(r){ return r.value; })
      });
    });
  });
});

app.post("/", function(req, res){
  var id = '82d362f0e9c65a9cb64319aeb209b970';

  db.get(id, function(err, user){
    user.subscriptions = req.body;
    db.insert(user, function(err, user){
      res.redirect('/');
    });
  });
});

app.get("/settings", function(req, res) {
  var id = '82d362f0e9c65a9cb64319aeb209b970';

  db.get(id, function(err, user){
    res.render('settings', {
      user: user,
      title: 'Settings'
    });
  });
});

app.post("/settings", function(req, res) {
  var id = '82d362f0e9c65a9cb64319aeb209b970';

  db.get(id, function(err, user){
    user.mute_notifications = req.body.user.mute_notifications === 'true';
    db.insert(user, function(err, doc){
      res.redirect("/settings");
    });
  });
});

app.post("/notifications", function(req, res){
  bus.emit('notification', req.body);
  res.send('ok');
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('Listening on port ' + port);
});

bus.on('notification', function(data){
  Message(data, function(message) {
    if (message) push.send(data, message);
  });
});
