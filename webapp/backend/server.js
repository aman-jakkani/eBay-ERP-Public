const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

//comment out prod
var https = require("https");
var fs = require("fs");
var path = require("path");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

//comment out prod
var certOptions = {
  key: fs.readFileSync(path.resolve('../../local-cert-generator/server.key')),
  cert: fs.readFileSync(path.resolve('../../local-cert-generator/server.crt'))
}
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

var server = https.createServer(certOptions, app);
// const server = http.createServer(app);

server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
