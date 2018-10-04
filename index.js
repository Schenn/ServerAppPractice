const env = require("./config");
const Server = require("./server");
const fs = require("fs");

const httpRouter = require("./lib/Router").httpRouter;
const httpsRouter = require('./lib/Router').httpsRouter;


const httpEnv = {
  port: env.port,
  env: env.env
};

const httpsEnv = {
  port: env.https.port,
  env: env.env,
};


let httpServer = new Server(httpRouter);
httpServer.createServer();
httpServer.listen(httpEnv);

if(fs.existsSync('./https/key.cert')){
  let httpsServer = new Server(httpsRouter);
  httpsServer.createServer(true, {
    'key': fs.readFileSync(env.https.key),
    'cert': fs.readFileSync(env.https.cert)
  });
  httpsServer.listen(httpsEnv);
}

