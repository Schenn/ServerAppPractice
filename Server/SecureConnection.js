const Connection = require("./Connection");
const https = require("https");
const _ = Symbol("private");

module.exports = class SecureConnection extends Connection {
  constructor(port, handler) {
    super();
    this[_] = {
      key: ''
    };
  }

  set key(key){
    this[_].key =  fs.readFileSync(key);
  }

  open(onListening = null){
    if(!onListening){
      onListening = ()=>{console.log(`Secure Connection created on port: ${this[_].port}`)};
    }
    this[_].server = https.createServer(this[_].key, this.handler);
    this[_].server.listen(this[_].port, onListening);
  }
};