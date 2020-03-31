const TextField = require("./TextField");
const crypto = require("crypto");

const _ = Symbol("private");

module.exports = class HashField extends TextField{

  #secret = "foo";
  #algo = "sha256";
  #encoding = "hex";

  withSecret(secret){
    this.#secret = secret;
    return this;
  }

  withAlgorithm(algo){
    this.#algo = algo;
    return this;
  }

  withEncoding(enc){
    this.#encoding = enc;
    return this;
  }

  set value(value){
    super.value = value;
  }

  get value(){
    let value = super.value;
    if(typeof value === "undefined" || value.length === 0){
      return false;
    }
    return crypto.createHmac(this[_].algo, this[_].secret).update(value).digest(this[_].encoding);
  }
};