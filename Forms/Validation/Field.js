const Required = require("./Options/Required");
const _ = Symbol("private");

module.exports = class Field {

  name = "";
  value = "";
  label = "";
  #options = new Map();

  set required(required){
    if(required && typeof this.#options.required === "undefined"){
      // If setting to true, and not already, make required.
      this.#options.required = new Required();
    } else if (!required && typeof this.#options.required !== "undefined") {
      // If setting to false, and currently true, unrequire.
      delete this.#options.required;
    }
  }

  addOption(optionName, option){
    let target = new option.option();
    if(typeof option.args !== "undefined"){
      for(let arg in option.args){
        target[arg] = option.args[arg];
      }
    }
    this.#options.set(optionName, target);
  }

  initOptions(options){
    for(let opt in options) {
      this.addOption(opt, options[opt]);
    }
  }

  getOption (opt){
    return this.#options.get(opt);
  }

  /**
   * @abstract
   */
  get html() {
    throw new Error(`Abstract Property Called. ${this.constructor.name} Needs HTML`);
  }

  isValid(){
    let valid;
    for(let [opt, option] of this.#options){
      valid = option.isValid(this.value);
      if(!valid){
        break;
      }
    }
    return valid;
  }
};