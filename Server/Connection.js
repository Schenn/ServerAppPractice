const Emitter = require("events");
const http = require("http");
const fs = require("fs");

const _ = Symbol("private");

module.exports = class Connection extends Emitter {
  constructor(port, handler) {
    super();
    this[_] = {
      port: port,
      handler: handler,
      server: null,
    };
  }

  get handler(){
    return this[_].handler;
  }

  get port(){
    return this[_].port;
  }

  open(onListening = null){
    if(!onListening){
      onListening = ()=>{console.log(`Connection created on port: ${this[_].port}`)};
    }
    this[_].server = http.createServer(this.handler);
    this[_].server.listen(this[_].port, onListening);
  }
};