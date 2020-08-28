const Required = require("./Options/Required");
const _ = Symbol("private");

module.exports = class Field {

  name = "";
  type = "";
  value = "";
  label = "";
  error = "";
  fieldOpts = {};
  #options = new Map();

  constructor(name, label){
    this.name = name;
    this.label = label;
    this.initOptions();
  }

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
    if(typeof option.props !== "undefined"){
      for(let arg in option.props){
        target[arg] = option.props[arg];
      }
    }
    this.#options.set(optionName, target);
  }

  initOptions(){
    for(let opt in this.fieldOpts) {
      this.addOption(opt, this.fieldOpts[opt]);
    }
  }

  getOption (opt){
    return this.#options.get(opt);
  }

  get labelHtml(){
    return `<label for="${this.name}">${this.label}</label>`;
  }

  /**
   * @abstract
   */
  get html() {
    let inputHtml = `
      <input type="${this.type}" name="${this.name}" value="${this.value}"
      ${this.required ? "required" : ''}
      ${Array.from(this.#options.values()).map((opt)=>{
        return opt.asAttribute();
    })}
      />`;
    throw new Error(`Abstract Property Called. ${this.constructor.name} Needs HTML`);
  }

  isValid(){
    let valid;
    try {
      for(let option of this.#options.values()){
          // option throws if its not valid. It doesn't return false.
          valid = option.isValid(this.value);
      }
    } catch(e){
      this.error = e;
      valid = false;
    }
    return valid;
  }
};