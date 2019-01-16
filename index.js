const env = require("./config");
const Server = require("./server");
const fs = require("fs");

const routes = require("./lib/Router");

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

createServer(routes.httpRouter);
createServer(routes.httpsRouter, true);
