var app = require("http").createServer(handler);
var path = require("path");
var io = require("socket.io").listen(app);
var fs = require("fs");

app.listen(80);

function handler (request, response) {
    console.log("request starting...");
     
    var filePath = "." + request.url;
    if (filePath == "./")
        filePath = "./index.htm";
     
    path.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { "Content-Type": "text/html" });
                    response.end(content, "utf-8");
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
}

io.sockets.on("connection", function (socket) {
    socket.on("play freq", function (data) {
        socket.broadcast.emit("play freq", data);
    });
    socket.on("kill freq", function (data) {
        socket.broadcast.emit("kill freq", data);
    });
});