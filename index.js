const path = require("path");
const env = require("./config");

const Server = require("./Server/Server");
const Router = require("./Server/Router");
const Writer = require("./Server/Writer");
const RouteCollector = require("./Server/RouteCollector");

let router = new Router();

const startServer = function(routes){
  router.addRoutes(routes.httpRoutes);
  router.addRoutes(routes.httpsRoutes, true);
  let server = new Server(router, env.port);
  server.security = env.https;
  server.createConnections(env.env);
};

if(env.env === "prod") {
  let writer = new Writer();
  writer.basePath = ".cache";
  writer.dir = "/routes/";
  writer.readSync('routecache.json', true, startServer);
} else {
  let routeCollector = new RouteCollector();
  routeCollector.buildCache(path.join(process.cwd(),"controllers"), startServer);
}