
//var framework = require('partial.js');
//var http = require('http');
var cluster = require('cluster');
var os = require('os');
var https = require('https');
var fs = require('fs');

var port = 8000;
var debug = true;



if (cluster.isMaster) {
  var i;
  var numCPUs = os.cpus().length;
  for (i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
}

var options = {
  key: fs.readFileSync(__dirname + '/m3key.pem'),
  cert: fs.readFileSync(__dirname + '/m3-cert.pem')
};


var framework = require('partial.js');
framework.run(https, debug, port, '192.168.6.8', options);
if (debug) {
  console.log("https://{0}:{1}/".format(framework.ip, framework.port));
}