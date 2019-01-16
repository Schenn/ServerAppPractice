const Field = require("./Field");
const Options = require("./Options/");

module.exports = class NumericField extends Field{
  get Options(){
    return {
      "MinMax":{option: Options.Size},
      "Type": {option: Options.Instance, args: {isInstanceOf: Number}},
      "Required": {option: Options.BoolOpt}
    };
  }

  set max(max){
    this.getOption("MinMax").max = max;
  }

  set min(min){
    this.getOption("MinMax").min = min;
  }
};