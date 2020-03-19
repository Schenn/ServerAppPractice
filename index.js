const path = require("path");
const env = require("./config");

const Server = require("./Server/Server");
const Router = require("./Router/Router");
const FakeDB = require("./lib/FakeDB");

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

/**
 * Create a temporary fake database in order to continue learning node on.
 * Once we get comfortable again, we need to replace this with mysql in docker.
 */
const createDatabase = (router)=>{
  let fakeDB = new FakeDB({subPath: "./.data/", fileName: 'developmentDB.json'});
  fakeDB.connect(()=>{
    // We need to figure out how we want to get the database to the route callback.
    listen();
  });
};

/**
 * Open the ports for connections.
 */
const listen = ()=>{
  server.createConnection(env.port);
  if(env.https){
    server.createConnection(env.https.port, env.https);
  }

};

createRouter().then((router)=>{
  createDatabase(router);
});
