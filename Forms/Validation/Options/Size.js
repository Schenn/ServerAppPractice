const Option = require("./Option");

module.exports = class Size extends Option {

  constructor(){
    super();
    this.min = 0;
    this.max = 0;
  }

  isValid(value) {
    if(typeof value === "undefined"){
      return !(this.min > 0 || this.max > 0);
    }
    let size = (typeof value === "number") ?
        value :
        value.length;

    if (this.min > 0 && size < this.min) {
      return false;
    }
    return !(this.max > 0 && size > this.max);
  }
};