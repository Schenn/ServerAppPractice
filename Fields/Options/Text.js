const Instance = require("./Instance");

module.exports = class Text extends Instance {
  constructor(){
    super();
    this.isInstanceOf = String;
    this.pattern = null;
  }

  isValid(value){
    if(this.pattern === null){
      return super.isValid(value);
    }
    if(super.isValid(value)){
      return new RegExp(this.pattern).test(value);
    }
  }
};