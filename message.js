var db = require('nano')('http://localhost:5984/notifications');
var Mustache = require("mustache");

module.exports = function(data, callback) {

  var getTemplate = function(callback) {
    db.get(data.namespace, function(err, doc){
      doc = doc || {};
      callback(doc.templates[data.event]);
    });
  };

  getTemplate(function(template){
    if (template) {
      callback(Mustache.render(template, data));
    } else {
      callback(null);
    }
  });

};
