const http = require("http");
const fs = require("fs");

const _ = Symbol("private");

module.exports = class Connection {
  /**
   * @param {number} port
   * @param {function} handler
   */
  constructor(port, handler=(req, res)=>{console.log("Heard Request.");}) {
    this[_] = {
      port: port,
      handler: handler,
      server: null,
    };
  }

  get handler(){
    return this[_].handler;
  }

  /**
   * Get the connection port
   * @return {*|number}
   */
  get port(){
    return this[_].port;
  }

  setServer(server, onListening){
    this[_].server = server;
    this[_].server.listen(this[_].port, onListening);
  }

  /**
   * Start listening for connections
   *
   * @param {function} onListening
   */
  open(onListening = null){
    if(!onListening){
      onListening = ()=>{console.log(`Connection created on port: ${this.port}`)};
    }

    this.setServer(http.createServer(this.handler), onListening);
  }
};