const Option = require("./Option");

module.exports = class Required extends Option {
  constructor(){
    super();
  }

  isValid(value){
    return typeof value !== "undefined" && value !== null && value !== '';
  }
};