"use strict";
var http = require('http');
var queryString = require('querystring');
module.exports = function () {
  // YOUR CODE HERE
  var getRoutes = [];
  var getCallbacks = [];
  var postRoutes = [];
  var postCallbacks = [];
  return {
    get: function(route, callback) {
        getRoutes.push(route);
        getCallbacks.push(callback);
        // callback(req, res);


    },
    post: function(route, callback){
      postRoutes.push(route);
      postCallbacks.push(callback);
    },
    listen: function(port){
      var self = this;
      var server=http.createServer(function(req,res){
        res.send = function(string){
          res.writeHead(200, {
          'Content-Type': 'text/plain'});
          res.end(string);
        }
        res.json = function(obj){
          res.writeHead(200, {
          'Content-Type': 'application/json'});
          res.end(JSON.stringify(obj));
        }
        if(req.method === 'GET') {
          for(var i =0; i <getRoutes.length; i++){
            var query = queryString.parse(req.url);
            console.log("QUERY", query);
            if(getRoutes[i] === req.url.split('?')[0]){
              req.query = query;
              console.log("REQ" ,req);
              getCallbacks[i](req, res);
              break;
            }
          }
        }
        if(req.method ==='POST') {
          var body = '';
          req.on('readable', function() {
              var chunk = req.read();
              console.log("CHUNK", chunk);
              if (chunk) body += chunk;
          });
          req.on('end', function() {
              // queryString is the querystring node built-in
              req.body = queryString.parse(body);
              for(var i =0; i < postRoutes.length; i++){
                console.log("req url", req.url)
                if(postRoutes[i] === req.url){
                  console.log("hi", body);
                  req.body = JSON.parse(body);
                  console.log("req body", req.body);
                  postCallbacks[i](req, res);
                  break;
                }
              }

          });

        }
      });
    server.listen(port);
    }
  };
};
