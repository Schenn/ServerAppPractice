const Option = require("./Option");

module.exports = class Required extends Option {
  isValid(value){
    return typeof value !== "undefined" && value !== null && value.length > 0;
  }
};