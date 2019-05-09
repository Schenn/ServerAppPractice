const TextField = require("./TextField");
const crypto = require("crypto");

const _ = Symbol("private");

module.exports = class HashField extends TextField{
  constructor(){
    this[_] = {
      secret: 'foo',
      algo: 'sha256',
      encoding: 'hex'
    };
  }

  withSecret(secret){
    this[_].secret = secret;
    return this;
  }

  withAlgorithm(algo){
    this[_].algo = algo;
    return this;
  }

  withEncoding(enc){
    this[_].encoding = enc;
    return this;
  }

  get value(){
    let value = super.value;
    if(value.length === 0){
      return false;
    }
    return crypto.createHmac(this[_].algo, this[_].secret).update(value).digest(this[_].encoding);
  }
};