var db = require('nano')('http://localhost:5984/notifications');
var Mustache = require("mustache");

var templates = {
  'account.signup': 'account signup, email: {{email}}, plan: {{plan}}',
  'account.canceled': 'account canceled, id: {{id}}, plan: {{plan}}'
};

module.exports = function(data) {

  var getTemplate = function() {
    return templates[data.event];
  };

  var template = getTemplate();
  if (template) return Mustache.render(template, data);
};
