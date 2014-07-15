var readline = require('readline'),
    request  = require('request'),
    qs       = require('querystring'),
    http     = require('http'),
    settings = require('env-settings'),
    faye     = require('faye')
;

function sendCommand(command) {
  var body = {
    text: command,
    callback: settings.callback
  }
  var message = JSON.stringify(body)
  console.log("Sending to server: " + settings.detection + " : " + message);
  request.post(settings.detection + "/command", {body: message}, function(err, response) {
    if (err) {
      console.error("\n", err);
      rl.prompt()
      return 0
    }
  });
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function createREPL() {
  rl.on('line', function(command) {
    if (command === 'quit') {
      rl.close()
    }

    var client = new faye.Client(settings.detection + '/');
    client.publish('/messages', command);

    rl.prompt()
  })

  rl.on('close', function() {
    process.exit();
  })

  rl.prompt()
}

function createResponse() {
  var client = new faye.Client(settings.detection + '/');
  client.subscribe('/responses', function(message) {
    console.log("\n" + message)
  });
}

function start() {
  createREPL()
  createResponse()
}

start()
