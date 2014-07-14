var readline = require('readline')
var request = require('request')
var qs = require('querystring');
var http = require('http')

function sendCommand(command, callbackUrl) {
  var body = {
    text: command,
    callback: process.env.BASE_URI
  }
  var message = JSON.stringify(body)
  console.log(message);
  request.post(callbackUrl, {body: message})
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function createREPL(callbackUrl) {
  rl.on('line', function(cmd) {
    if (cmd === 'quit') {
      rl.close()
    }

    sendCommand(cmd, callbackUrl)

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

  var callbackUrl = process.env.CALLBACK_URL || "http://localhost:" + port
  console.log("Callback URL " + callbackUrl)
  createREPL(callbackUrl)
  createCallbackServer(port)
}

start()
