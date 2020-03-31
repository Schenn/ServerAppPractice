const Option = require("./Option");

module.exports = class Instance extends Option {

  isInstanceOf = null;

  isValid(value){
    if(this.isInstanceOf !== null){
      return value instanceof this.isInstanceOf;
    }
    return true;
  }
};