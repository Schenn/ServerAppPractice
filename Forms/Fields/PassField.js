const TextField = require("./TextField");
const crypto = require("crypto");

module.exports = class PassField extends TextField{

  #secret = "foo";
  #algo = "sha256";
  #encoding = "hex";
  required = true;

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

  get encodedValue(){
    let value = this.value;
    let ret = null;
    if(typeof value !== "undefined" && value.length === 0){
      ret = crypto.createHmac(this.#algo, this.#secret).update(value).digest(this.#encoding);
    }
    return ret;
  }

};