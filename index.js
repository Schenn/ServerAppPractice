const env = require("./config");
const Server = require("./server");
const fs = require("fs");

const Router = require("./lib/Router");
const Writer = require("./lib/Writer");

const createServer = function(routers, secure=false){
  let server = new Server(routers);
  if(secure && fs.existsSync(env.https.keycert)){
    server.createServer(true, {
      'key': fs.readFileSync(env.https.key),
      'cert': fs.readFileSync(env.https.cert)
    });
  } else {
    server.createServer();
  }

  server.listen({
    port: (secure) ? env.https.port : env.port,
    env: env.env
  });
};

let router = new Router();
let writer = new Writer();
writer.basePath = ".cache";
writer.dir = "/routes/";

writer.readSync('routecache.json', true, (data)=>{
  router.addRoutes(data.httpRoutes);
  router.addRoutes(data.httpsRoutes, true);
});

createServer(router.httpRoutes);
createServer(router.httpsRoutes, true);
