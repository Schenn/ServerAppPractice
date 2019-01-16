module.exports = class Field {

  constructor(){
    this._ = Symbol(this.constructor.name);
    this[this._] = {
      name: '',
      value: '',
      options: {},

    };
  }

  set value(value){
    this[this._].value = value;
  }

  get value(){
    return this[this._].value;
  }

  set required(required){
    if(typeof this[this._].options.required !== "undefined"){
      this.getOption("required").is = required;
    }
  }

  initOptions(options){
    for(let opt of options) {
      let option = options[opt];
      let target = new option.option();
      if(typeof option.args !== "undefined"){
        for(let arg of option.args){
          target[arg] = option.args[arg];
        }
      }
      this[this._].options[opt] = target;
    }
  }

  getOption (opt){
    return this[this._].options[opt];
  }

  isValid(){
    let valid = true;
    for(let opt of this[this._].options){
      let option = this[this._].options[opt];
      valid = option.isValid(this.value);
      if(!valid){
        break;
      }
    }
    return valid;
  }
};