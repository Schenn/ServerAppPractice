const Options = require("./Options/");
const Field = require("./Field");

const FieldOpts = {
  "type": {option: Options.Instance, args:{isInstanceOf:Boolean}},
};

module.exports = class BoolField extends Field {
  constructor(){
    super();
    this.initOptions(FieldOpts);
    this.required = true;
  }

  requireTrue(){
    this.initOptions({"value":{option: Options.BoolOpt}});
    return this;
  }

  requireFalse(){
    this.initOptions({"value":{option: Options.BoolOpt, args: {is: false}}});
    return this;
  }
};