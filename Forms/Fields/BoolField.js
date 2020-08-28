const Options = require("./Options");
const Field = require("./Field");

module.exports = class BoolField extends Field {
  type = "checkbox";

  isValid(){
    // If true required, check for value 'on'. If false, check if value is not 'on'.
    return (this.required) ? this.value === "on" : this.value !== "on";
  }
};