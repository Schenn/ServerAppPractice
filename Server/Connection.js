const http = require("http");
const fs = require("fs");

module.exports = class Connection {
  #port = '';
  #onRequest = ()=>{};
  #server = null;

  /**
   * @param {number} port
   * @param {function} handler
   */
  constructor(port, handler=(req, res)=>{console.log("Heard Request.");}) {
    this.#port = port;
    this.#onRequest = handler;
  }

  get handler(){
    return this.#onRequest;
  }

  /**
   * Get the connection port
   * @return {*|number}
   */
  get port(){
    return this.#port;
  }

  setServer(server, onListening){
    this.#server = server;
    this.#server.listen(this.#port, onListening);
  }

  /**
   * Start listening for connections
   *
   * @param {function} onListening
   */
  open(onListening = null){
    if(!onListening){
      onListening = ()=>{
        console.log(`Connection created on port: ${this.#port}`)
      };
    }

    this.setServer(http.createServer(this.#onRequest), onListening);
  }
};