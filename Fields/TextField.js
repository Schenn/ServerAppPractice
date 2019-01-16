const Field = require("./Field");
const Options = require("./Options/");

const FieldOpts = {
  "length": {option: Options.Size},
  "type": {option: Options.Text},
  "required": {option: Options.Required}
};

module.exports = class TextField extends Field{

  constructor(){
    super();
    this.initOptions(FieldOpts);
  }

  set maxLength(maxLength){
    this.getOption("length").max = maxLength;
  }

  set minLength(minLength){
    this.getOption("length").min = minLength;
  }
  
  set pattern(pattern){
    this.getOption("type").pattern = pattern;
  }

};