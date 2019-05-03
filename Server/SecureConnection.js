const Connection = require("./Connection");
const https = require("https");
const fs = require("fs");
const _ = Symbol("private");

module.exports = class SecureConnection extends Connection {
  /**
   * @param {number} port
   * @param {function} handler
   * @param {string} key
   */
  constructor(port, handler, key) {
    super(port, handler);
    this[_] = {
      key: fs.readFileSync(key)
    };
  }

  /**
   * Start listening for connections.
   *
   * @param onListening
   */
  open(onListening = null){
    if(!onListening){
      onListening = ()=>{console.log(`Secure Connection created on port: ${this[_].port}`)};
    }
    this[_].server = https.createServer(this[_].key, this.handler);
    this[_].server.listen(this[_].port, onListening);
  }
};