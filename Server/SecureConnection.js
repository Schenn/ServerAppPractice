const Connection = require("./Connection");
const https = require("https");
const fs = require("fs");
const _ = Symbol("private");

module.exports = class SecureConnection extends Connection {
  /**
   * @param {number} port
   * @param {function} handler
   * @param {{key: string, cert: string}} certs
   */
  constructor(port, handler, certs) {
    super(port, handler);
    this[_] = {
      key: fs.readFileSync(certs.key),
      cert: fs.readFileSync(certs.cert)
    };
  }

  /**
   * Start listening for connections.
   *
   * @param onListening
   */
  open(onListening = null){
    if(!onListening){
      onListening = ()=>{console.log(`Secure Connection created on port: ${this.port}`)};
    }
    this.setServer(https.createServer({key: this[_].key, cert: this[_].cert}, this.handler), onListening);
  }
};