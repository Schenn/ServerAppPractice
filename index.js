const path = require("path");
const env = require("./config");

const Server = require("./Server/Server");
const Router = require("./Router/Router");

let router = new Router();

const server = new Server();
server.handler = router.handle.bind(router);
server.environment = env.env;

/**
 * Open the ports for connections.
 */
const listen = ()=>{
  server.createConnection(env.port);
  if(env.https){
    server.createConnection(env.https.port, env.https);
  }

};

router.buildCache(path.join(process.cwd(),"Controllers")).then((router)=>{
  listen();
});
