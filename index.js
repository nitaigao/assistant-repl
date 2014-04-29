var readline = require('readline')
var request = require('request')
var qs = require('querystring');
var http = require('http')

function sendCommand(command) {
  var body = {
    text: command,
    callback: "http://localhost:7000"
  }
  var message = JSON.stringify(body)
  console.log(message);
  request.post("http://localhost:8080", {body: message})
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
  createREPL()
  createCallbackServer(7000)
}

start()
