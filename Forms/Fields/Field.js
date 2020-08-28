const Required = require("./Options/Required");

module.exports = class Field {

  name = "";
  type = "";
  value = "";
  label = "";
  error = "";
  required = false;
  fieldOpts = {};
  #options = new Map();

  constructor(name, label){
    this.name = name;
    this.label = label;
  }

  addOption(optionName, option){
    let target = new option.option();
    if(typeof option.props !== "undefined"){
      for(let arg of Object.keys(option.props)){
        target[arg] = option.props[arg];
      }
    }
    this.#options.set(optionName, target);
  }

  initOptions(props){
    for(let opt of Object.keys(this.fieldOpts)) {
      if(typeof props[opt] !== "undefined"){
        Object.assign(this.fieldOpts[opt].props, props[opt]);
      }
      this.addOption(opt, this.fieldOpts[opt]);
    }
  }

  getOption (opt){
    return this.#options.get(opt);
  }

  get labelHtml(){
    return `<label for="${this.name}">${this.label}</label>`;
  }

  optionsAsAttributes(){
    return Array.from(this.#options.values()).map((opt)=>{
      return opt.asAttribute();
    }).join(' ');
  }

  /**
   * @abstract
   */
  get html() {
    return `
      <input type="${this.type}" name="${this.name}" 
      ${this.value !== "" ? `value="${this.value}"` : ''}
      ${this.required ? 'required' : ''}
      ${this.optionsAsAttributes()}
      />`;
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