const Option = require("./Option");

module.exports = class BoolOpt extends Option {

  is = true;

  constructor(){
    super();
  }

  isValid(value){
    if(typeof value !== "boolean"){
      if(value === "1" || value === "true" || value === "0" || value === "false"){
        value = (value === "1" || value === "true");
      }
    }
    if(typeof value === "boolean"){
      return value === this.is;
    }
    throw "Invalid value for boolean option. Got " + value;
  }
};