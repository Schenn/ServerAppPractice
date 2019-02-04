const env = require("./config");
const Server = require("./lib/Server");

const Router = require("./lib/Router");
const Writer = require("./lib/Writer");

let router = new Router();
let writer = new Writer();
writer.basePath = ".cache";
writer.dir = "/routes/";

writer.readSync('routecache.json', true, (data)=>{
  router.addRoutes(data.httpRoutes);
  router.addRoutes(data.httpsRoutes, true);
});

let server = new Server(router, env.port);
server.security = env.https;
server.createConnections();