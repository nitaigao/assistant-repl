var readline = require('readline')
var request = require('request')
var qs = require('querystring');
var http = require('http')

function sendCommand(command) {
  var body = {
    text: command,
    callback: process.env.BASE_URI
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
  console.log(process.env.BASE_IRI)
  // createREPL()
  //
  // var port = Number(process.env.PORT || 7000);
  // console.log("Started on port " + port)
  //
  // createCallbackServer(port)
}

start()
