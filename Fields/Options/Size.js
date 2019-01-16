const Option = require("./Option");

module.exports = class Size extends Option {

  constructor(){
    super();
    this.min = 0;
    this.max = 0;
  }

  isValid(value){
    let size = (typeof value === "number") ?
        value :
        value.length;

    if(this.min > 0 && size < this.min){
      return false;
    }
    if(this.max > 0 && size > this.max){
      return false;
    }
    return true;
  }
};