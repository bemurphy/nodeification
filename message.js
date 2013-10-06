var Mustache = require("mustache");

var templates = {
  'account.signup': 'account signup, email: {{email}}, plan: {{plan}}',
  'account.canceled': 'account canceled, id: {{id}}, plan: {{plan}}'
};

module.exports = function(data) {
  var template = templates[data.key];
  return Mustache.render(template, data);
};
