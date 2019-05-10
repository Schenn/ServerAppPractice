const Options = require("./Options/");
const Field = require("./Field");

module.exports = class BoolField extends Field {
  constructor(){
    super();
    this.initOptions({});
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