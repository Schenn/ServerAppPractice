const env = require("./config");
const Server = require("./server");
const fs = require("fs");

const httpHandlers = {
  ping: (data, cb)=>{
    cb(200);
  }
};

const httpsHandlers = {
  foo: (data, cb)=>{
    cb(406, {'response': 'got https foo path'});
  },
  ping: (data, cb)=>{
    cb(200);
  }
};

const httpRouter = {
  'ping': {
    handle: httpHandlers.ping,
  }
};

const httpsRouter = {
  'foo': {
    handle: httpsHandlers.foo,
    type: 'json'
  },
  'ping': {
    handle: httpsHandlers.ping
  }
};

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

let httpsServer = new Server(httpsRouter);
httpsServer.createServer(true, {
  'key': fs.readFileSync(env.https.key),
  'cert': fs.readFileSync(env.https.cert)
});
httpsServer.listen(httpsEnv);