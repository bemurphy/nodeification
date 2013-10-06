var Pushover = require("pushover-notifications");
var directory = require("./directory");

var client = new Pushover({
  user: process.env.PUSHOVER_USER,
  token: process.env.PUSHOVER_TOKEN
});

exports.send = function(data, message) {
  var routing = {
    namespace: data.namespace,
    event: data.event,
    medium: 'pushover'
  };

  directory.eachSubscribed(routing, function(contact){
    var msg = {
      user: contact,
      message: message
    };

    client.send(msg);
  });
};
