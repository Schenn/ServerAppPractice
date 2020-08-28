const path = require("path");
const env = require("./config");
const mysqlx = require('@mysql/xdevapi');

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

  setTimeout(()=>{
    let conn = mysqlx.createConnection({host: "database",
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_USER});

    conn.query("SELECT 1 AS success", (err, results, fields)=>{
      if(err) {throw err;}
      console.log("Success? : ", results[0].success);
    });

    conn.end();
  }, 20000);

};

router.buildCache(path.join(process.cwd(),"Controllers")).then((router)=>{
  listen();
});
