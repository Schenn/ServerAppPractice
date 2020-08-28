const Options = require("./Options");
const Field = require("./Field");

module.exports = class BoolField extends Field {
  is = true;

  requireTrue(){
    this.is = true;
    return this;
  }

  requireFalse(){
    this.is = false;
    return this;
  }

  isValid(){
    // If true required, check for value 'on'. If false, check if value is not 'on'.
    return (this.is) ? this.value === "on" : this.value !== "on";
  }

  get html(){
  return `
        <input type="checkbox" name="${this.name}" 
         ${this.is ? 'required' : ''}
         />
        `;
  }
};