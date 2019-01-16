const Field = require("./Field");
const Options = require("./Options/");

module.exports = class TextField extends Field{

  get Options(){
    return {
      "length": {option: Options.Size},
      "type": {option: Options.Text},
      "required": {option: Options.BoolOpt}
    };
  }

  set maxLength(maxLength){
    this.getOption("length").max = maxLength;
  }

  set minLength(minLength){
    this.getOption("length").min = minLength;
  }

  set required(required){
    this.getOption("required").is = required;
  }

  set pattern(pattern){
    this.getOption("type").pattern = pattern;
  }

};