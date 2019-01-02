//
// Dependencies
var server = require('./server');
var cluster = require('cluster');
var os = require('os');

if (cluster.isMaster){
  // Fork the process
  for (var i = 0; i < os.cpus().length; i++){
    cluster.fork();
  }
} else {
  // Start the HTTP server
  server.init();
}