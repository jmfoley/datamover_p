

var http = require('http');
var cluster = require('cluster');
var os = require('os');
//var https = require('https');
var fs = require('fs');


var port = 3001;
var debug = false;



if (cluster.isMaster) {
  var i;
  var numCPUs = os.cpus().length;
  for (i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  return;
}

var options = {
  key: fs.readFileSync(__dirname + '/m3key.pem'),
  cert: fs.readFileSync(__dirname + '/m3-cert.pem')
};

process.on('uncaughtException',function(err){
	console.log('Unhandled execption: ' + err);
});


var framework = require('partial.js');
//framework.run(https, debug, port, '192.168.6.8', options);
//framework.run(http, debug, port, '192.168.6.8');
framework.run(http, debug, port, '10.215.72.73');

if (debug) {
  console.log("https://{0}:{1}/".format(framework.ip, framework.port));
}