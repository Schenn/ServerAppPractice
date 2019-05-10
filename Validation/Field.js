const Required = require("./Options/Required");
const _ = Symbol("private");

module.exports = class Field {

  constructor(){
    this[_] = {
      name: '',
      value: '',
      options: {},

    };
  }

  set value(value){
    this[_].value = value;
  }

  get value(){
    return this[_].value;
  }

  set required(required){
    if(required && typeof this[_].options.required === "undefined"){
      // If setting to true, and not already, make required.
      this[_].options.required = new Required();
    } else if (!required && typeof this[_].options.required !== "undefined") {
      // If setting to false, and currently true, unrequire.
      delete this[_].options.required;
    }

  }

  addOption(optionName, option){
    let target = new option.option();
    if(typeof option.args !== "undefined"){
      for(let arg in option.args){
        target[arg] = option.args[arg];
      }
    }
    this[_].options[optionName] = target;
  }

  initOptions(options){
    for(let opt in options) {
      this.addOption(opt, options[opt]);
    }
  }

  getOption (opt){
    return this[_].options[opt];
  }

  isValid(){
    let valid;
    for(let opt in this[_].options){
      let option = this[_].options[opt];
      valid = option.isValid(this.value);
      if(!valid){
        break;
      }
    }
    return valid;
  }
};