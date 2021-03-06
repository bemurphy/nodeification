var db = require('nano')('http://localhost:5984/notifications');
var u = require('underscore');

var ensureDefault = function(doc, key, val) {
  doc[key] = doc[key] || val;
};

var save = function(doc) {
  db.insert(doc, function(err, doc){
    console.log(doc);
  });
};

var ensureSubPath = function(doc, config) {
  var ns = config.namespace;
  var event = config.event;

  ensureDefault(doc, 'subscriptions', {});
  ensureDefault(doc.subscriptions, ns, {});
  ensureDefault(doc.subscriptions[ns], event, []);
};

exports.removeSubscription = function(id, config, callback) {
  var c = config;

  db.get(id, function(err, doc) {
    ensureSubPath(doc, config);

    if (doc.subscriptions[c.namespace][c.event].indexOf(c.medium) !== -1) {
      doc.subscriptions[c.namespace][c.event] = u.without(doc.subscriptions[c.namespace][c.event], c.medium);
      save(doc);
    }
  });
};

exports.addSubscription = function(id, config, callback) {
  var c = config;

  db.get(id, function(err, doc) {
    ensureSubPath(doc, config);

    if (doc.subscriptions[c.namespace][c.event].indexOf(c.medium) === -1) {
      doc.subscriptions[c.namespace][c.event].push(c.medium);
      save(doc);
    }
  });
};

var findSubscribed = exports.findSubscribed = function(config, callback) {
  var key = [config.namespace, config.event, config.medium];

  db.view('notifications', 'subscriptions', {key: key}, function(err, body){
    var contacts = u.collect(body.rows, function(r){
      return r.value;
    });

    callback(contacts);
  });
};

exports.eachSubscribed = function(config, callback) {
  findSubscribed(config, function(contacts){
    u.each(contacts, function(contact){
      callback(contact);
    });
  });
};
