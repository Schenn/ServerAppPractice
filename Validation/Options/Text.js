const Option = require("./Option");

module.exports = class Text extends Option {
  constructor(){
    super();
    this.pattern = null;
  }

  isValid(value){
    return (this.pattern === null) ? true:
      new RegExp(this.pattern).test(value);
  }
};