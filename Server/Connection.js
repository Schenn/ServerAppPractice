const http = require("http");
const fs = require("fs");

const _ = Symbol("private");

module.exports = class Connection {
  /**
   * @param {number} port
   * @param {function} handler
   */
  constructor(port, handler) {
    this[_] = {
      port: port,
      handler: handler,
      server: null,
    };
  }

  /**
   * Get the connection handler
   * @return {*|Function}
   */
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

  /**
   * Start listening for connections
   *
   * @param {function} onListening
   */
  open(onListening = null){
    if(!onListening){
      onListening = ()=>{console.log(`Connection created on port: ${this[_].port}`)};
    }
    this[_].server = http.createServer(this.handler);
    this[_].server.listen(this[_].port, onListening);
  }
};