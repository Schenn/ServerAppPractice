const path = require("path");
const env = require("./config");

const DBX = require("../Database/DBX");
const Server = require("../Server/Server");
const Router = require("../Router/Router");

let router = new Router();

const server = new Server();
server.handler = router.handle.bind(router);
server.environment = env.env;

DBX.addHost("database", process.env.DB_PORT);
DBX.setUser(process.env.MYSQL_USER, process.env.MYSQL_PASSWORD);

module.exports = ()=>{

  let db = new DBX();

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
    db.connect(process.env.MYSQL_DATABASE).then(listen).catch((e)=>{console.log(e);});
  });
};


