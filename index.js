const path = require("path");
const env = require("./config");

const Server = require("./Server/Server");
const Router = require("./Server/Router");
const RouteCollector = require("./Collectors/RouteCollector");

const startServer = function(router){
  let server = new Server(router);
  server.environment = env.env;
  server.createConnection(env.port);
  server.createConnection(env.https.port, env.https.key);
};

let routeCollector = new RouteCollector();
routeCollector.buildCache(path.join(process.cwd(),"Controllers"), startServer);

