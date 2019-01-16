const Options = require("./Options/");
const Field = require("./Field");

const FieldOpts = {
  "type": {option: Options.Instance, args:{isInstanceOf:Boolean}},
  "required": {option: Options.Required}
};

module.exports = class BoolField extends Field {
  constructor(){
    super();
    this.initOptions(FieldOpts);
  }

  requireTrue(){
    this.initOptions({"value":{option: Options.BoolOpt}})
  }

  requireFalse(){
    this.initOptions({"value":{option: Options.BoolOpt, args: {is: false}}})
  }
};