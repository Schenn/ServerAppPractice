const Field = require("./Field");
const Options = require("./Options");

module.exports = class TextField extends Field{

  required = true;
  fieldOpts = {
    "length": {option: Options.Size, props: {useLength:true}},
    "pattern": {option: Options.Pattern}
  };

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