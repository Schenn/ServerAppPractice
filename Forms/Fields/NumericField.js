const Field = require("./Field");
const Options = require("./Options");

const FieldOpts = {
  "MinMax":{option: Options.Size},
  "Type": {option: Options.Instance, args: {isInstanceOf: Number}},
};

module.exports = class NumericField extends Field{
  constructor(){
    super();
    this.initOptions(FieldOpts);
    this.required = true;
  }

  set max(max){
    this.getOption("MinMax").max = max;
  }

  set min(min){
    this.getOption("MinMax").min = min;
  }
};