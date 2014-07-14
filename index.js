var readline = require('readline')
var request = require('request')
var qs = require('querystring');
var http = require('http')

process.env.NODE_ENV = process.env.NODE_ENV || "development"

var DETECTION_URLS = {
  "development" : "http://localhost:8080",
  "production"  : "http://assistant-detection.herokuapp.com"
}

var DETECTION_URL = DETECTION_URLS[process.env.NODE_ENV]

var CALLBACK_URLS = {
  "development" : "http://localhost:7000",
  "production"  : "http://assistant-repl.herokuapp.com"
}

var CALLBACK_URL = CALLBACK_URLS[process.env.NODE_ENV]

function sendCommand(command) {
  var body = {
    text: command,
    callback: CALLBACK_URL
  }
  var message = JSON.stringify(body)
  console.log(message);
  request.post(DETECTION_URL, {body: message})
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
