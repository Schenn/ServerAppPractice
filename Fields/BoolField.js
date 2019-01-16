const Options = require("./Options/");
const Field = require("./Field");

module.exports = class BoolField extends Field {
  get Options(){
    return {
      "type": {option: Options.Instance, args:{isInstanceOf:Boolean}},
      "required": {option: Options.BoolOpt}
    };
  }
};