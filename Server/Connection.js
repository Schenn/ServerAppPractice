const Emitter = require("events");
const http = require("http");

const _ = Symbol("private");

module.exports = class Connection extends Emitter {
  constructor(port) {
    super();
    this[_] = {
      port: port,
      routeHandle: null,
      server: null
    };
    this.__ = Symbol("protected");
    this[this.__] = {
      get routeHandler(){
        return this[_].routeHandle
      },
      set server(server){
        this[_].server = server;
        this[_].server.listen(this[_].port);
      },
      get server(){
        return this[_].server;
      }
    };
  }

  set routeHandler(handler){
    this[_].routeHandle = handler;
  }

  get port(){
    return this[_].port;
  }

  listen(){
    this[this.__].server = http.createServer(this[_].routeHandle);
  }
};