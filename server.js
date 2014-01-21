var http = require("http");
var fs   = require("fs");
var path = require("path");
var mime = require("mime");
var cache = {};

var send404 = function(res) {
  res.writeHead(404, {"Content-Type": "text/plain"});
  res.write("Error 404: resource not found.");
  res.end();
}

var sendFile = function(res, filePath, fileContents) {
  res.writeHead(200, {
    "Content-Type": mime.lookup(path.basename(filePath))
  });
  res.end(fileContents);
}

var serveStatic = function(res, cache, absPath) {
  if(cache[absPath]) {
    sendFile(res, absPath, cache[absPath]); // file contents already cached, just send as-is
  } else {
    fs.exists(absPath, function(exists) {
      if(exists) {
        fs.readFile(absPath, function(err, data) {
          if(err) {
            console.log("Error trying to get file: " + absPath + " error: " + err + "; responding with 404");
            send404(res);
          } else {
            cache[absPath] = data;
            sendFile(res, absPath, data);
          }
        });
      } else { // file does not exist
        console.log("file requested but it does not exist: " + absPath + "; responding with 404");
        send404(res);
      }
    });
  }
}

var server = http.createServer(function(req, res) {
  var filePath = false;

  if (req.url === "/") {
    filePath = "public/index.html";
  } else {
    filePath = "public" + req.url;
  }

  var absPath = "./" + filePath;
  serveStatic(res, cache, absPath);
});

server.listen(3000, function() {
  console.log("NodeChat server running on port 3000");
});

var chatServer = require("./lib/chat_server");
chatServer.listen(server);
