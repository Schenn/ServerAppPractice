const Connection = require("./Connection");
const https = require("https");
const fs = require("fs");
const _ = Symbol("private");

module.exports = class SecureConnection extends Connection {
  #key = '';
  #cert = '';

  /**
   * @param {number} port
   * @param {function} handler
   * @param {{key: string, cert: string}} certs
   */
  constructor(port, handler, certs) {
    super(port, handler);
    this.#key= fs.readFileSync(certs.key),
    this.#cert = fs.readFileSync(certs.cert)
  };

  /**
   * Start listening for connections.
   *
   * @param onListening
   */
  open(onListening = null){
    if(!onListening){
      onListening = ()=>{console.log(`Secure Connection created on port: ${this.port}`)};
    }
    this.setServer(https.createServer({key: this.#key, cert: this.#cert}, this.#handler), onListening);
  }
};