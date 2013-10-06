var u = require('underscore');

var User = module.exports = function(doc) {
  this.doc = doc;
  this.contact = doc.contact;
};

User.prototype.subscribed = function(namespace, event, medium) {
  var sub = this.doc.subscriptions;

  return sub && sub[namespace] &&
    sub[namespace][event] &&
    u.contains(sub[namespace][event], medium);
};
