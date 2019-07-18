const Field = require("./Field");
const Options = require("./Options");

const FieldOpts = {
  "length": {option: Options.Size},
  "type": {option: Options.Text}
};

module.exports = class TextField extends Field{

  constructor(){
    super();
    this.initOptions(FieldOpts);
    this.required = true;
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