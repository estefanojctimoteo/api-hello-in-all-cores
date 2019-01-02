/*
 * Server-related tasks
 *
 */

 // Dependencies
 var http = require('http');
 var https = require('https');
 var url = require('url');
 var strDecoder = require('string_decoder').StringDecoder;
 var config = require('./config');
 var fs = require('fs');

 // Instantiate the server module object
var server = {};

 // HTTP server
 server.httpServer = http.createServer(function(req,res){
   unifiedServer(req,res);
 });
 
 // HTTPS server
 var httpsServerOptions = {
   'key' : fs.readFileSync('./https/key.pem'),
   'cert' : fs.readFileSync('./https/cert.pem'),
 }
 server.httpsServer = https.createServer(httpsServerOptions,  function(req,res){
   unifiedServer(req,res);
 });
 
 // Logic for both the http and https server
 var unifiedServer = function(req,res){
 
   // Get the URL; parse it
   var parsedUrl = url.parse(req.url,true)
 
   // Get the path
   var path = parsedUrl.pathname;
   var trimmedPath = path.replace(/^\/+|\/+$/g, '');
 
   //Get the query string (as on object)
   var queryStringObject = parsedUrl.query;
 
   // Get the HTTP method
   var method = req.method.toLowerCase();
 
   // Get the headers (as an object)
   var headers = req.headers;
 
   // Get the payload (if any)
   var decoder = new strDecoder('utf-8');
   var buffer = '';
   req.on('data',function(data){
     buffer += decoder.write(data);
   });
   req.on('end',function(){
     buffer += decoder.end();
 
     // Choose the handler this request should go to. If no one is found, use the notFound handler.
     var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
 
     // Construct the data object to send to the handler
     var data = {
       'trimmedPath' : trimmedPath,
       'queryStringObject' : queryStringObject,
       'method' : method,
       'headers' : headers,
       'payload' : buffer,
     };
 
     // Route the request to the handler specified in the router
     chosenHandler(data,function(statusCode,payload){
       // Use the status code called back by the handler, or default to 200
       statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
 
       // Use the payload called back by the handler or default to an empty object
       payload = typeof(payload) == 'object' ? payload : {};
 
       var _hello = {
         'hello' : 'Hi! Welcome! This is the Hello API, created for the Pirple Homework Assignment #1!'
       }
 
       // Convert the payload to a string
       var strPayload = trimmedPath === 'hello' ? JSON.stringify(_hello) : JSON.stringify(payload);
 ;
       // Return the response
       res.setHeader('Content-Type','application/json');
       res.writeHead(statusCode);      
       res.end(strPayload);
 
       // Log
       console.log('Returning this response: ', statusCode, strPayload);      
     });
   });  
 };
 
 // Define the handlers
 var handlers = {};
 
 // Ping handler
 handlers.ping = function(data,callback){
   callback(200);
 }
 
 // Ping handler
 handlers.hello = function(data,callback){
   callback(200);
 }
 
 // Not found handler
 handlers.notFound = function(data,callback){
   callback(404);
 };
 
 // Define a request router
 var router = {
   'ping' : handlers.ping,
   'hello' : handlers.hello,
 }
 // Init script
server.init = function(){
  // Start the HTTP server
  server.httpServer.listen(config.httpPort,function(){
    console.log('\x1b[36m%s\x1b[0m','The HTTP server is listening on port '+config.httpPort);
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort,function(){
    console.log('\x1b[35m%s\x1b[0m','The HTTPS server is listening on port '+config.httpsPort);
  });
};

 // Export the module
 module.exports = server;