var readline = require('readline'),
    request  = require('request'),
    qs       = require('querystring'),
    http     = require('http'),
    settings = require('env-settings')
;

function sendCommand(command) {
  var body = {
    text: command,
    callback: settings.callback
  }
  var message = JSON.stringify(body)
  console.log(message);
  request.post(settings.detection, {body: message})
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function createREPL() {
  rl.on('line', function(cmd) {
    if (cmd === 'quit') {
      rl.close()
    }

    sendCommand(cmd)

    rl.prompt()
  })

  rl.on('close', function() {
    process.exit();
  })

  rl.prompt()
}

function createCallbackServer(port) {
  http.createServer(function (req, res) {
    var body = "";

    req.on('data', function (chunk) {
      body += chunk;
    });

    req.on('end', function () {
      res.end('OK!');

      var responseData = JSON.parse(body)
      console.log("\n" + responseData.result)
      rl.prompt()
    })

  }).listen(port)
}

function start() {
  var port = Number(process.env.PORT || 7000);
  console.log("Started on port " + port)

  createREPL()
  createCallbackServer(port)
}

start()
