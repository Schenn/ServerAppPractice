const Option = require("./Option");

module.exports = class BoolOpt extends Option {
  constructor(){
    super();
    this.is = true;
  }

  isValid(value){
    if(typeof value === "boolean"){
      return value === this.is;
    }
    throw "Invalid value for boolean option. Got " + value;
  }
};