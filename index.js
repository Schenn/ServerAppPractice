const path = require("path");
const env = require("./config");

const Server = require("./Server/Server");
const Router = require("./Router/Router");

const server = new Server();
server.environment = env.env;

/**
 * A Router is a class which interprets incoming paths and intelligently passes the request to the appropriate handler.
 *
 *  Assigns the router handler to the server handler.
 * @return {Promise}
 */
const createRouter = ()=>{
  let router = new Router();
  server.handler = router.handle.bind(router);
  return router.buildCache(path.join(process.cwd(),"Controllers"));
};

const listen = ()=>{
  server.createConnection(env.port);
  if(env.https){
    server.createConnection(env.https.port, env.https.key);
  }
};

createRouter().then(()=>{
  listen();
});
