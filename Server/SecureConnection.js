const Emitter = require("events");
const http = require("http");
const https = require("https");
const fs = require("fs");

const _ = Symbol("private");

module.exports = class Connection extends Emitter {
  constructor(port, handler) {
    super();
    this[_] = {
      port: port,
      handler: handler,
      server: null,
      key: ''
    };
  }

  get handler(){
    return this[_].handler;
  }

  get port(){
    return this[_].port;
  }

  set key(key){
    this[_].key =  fs.readFileSync(key);
  }

  isSecure(){
    return this[_].key !== '';
  }

  open(onListening){
    this[_].server = this.isSecure() ?
      https.createServer(this[_].key, this.handler) :
      http.createServer(this.handler);
    this[_].server.listen(this[_].port, onListening);
  }
};