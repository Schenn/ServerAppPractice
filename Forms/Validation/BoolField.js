const Options = require("./Options");
const Field = require("./Field");

module.exports = class BoolField extends Field {
  constructor(){
    super();
    this.required = true;
    this.is = true;
  }

  requireTrue(){
    this.is = true;
    return this;
  }

  requireFalse(){
    this.is = false;
    return this;
  }

  isValid(){
    if(this.is){
      return (this.value === "1" || this.value === "true" || this.value === 1 || this.value === true);
    } else {
      return (this.value === "0" || this.value === "false" || this.value === 0 || this.value === false);
    }
  }
};