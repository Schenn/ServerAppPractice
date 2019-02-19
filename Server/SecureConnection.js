const Connection = require("./Connection");
const https = require("https");
const fs = require("fs");

const _ = Symbol("private");

module.exports = class SecureConnection extends Connection {
  constructor(port){
    super(port);
    this[_] = {
      key: null,
      cert: null,
    };
  }

  set key(key){
    this[_].key =  fs.readFileSync(key);
  }

  set cert(cert){
    this[_].cert = fs.readFileSync(cert);
  }

  listen(){
    this[super.__].server = https.createServer(this[_].key, this.port);
  }
};