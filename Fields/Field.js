module.exports = class Field {
  get Options(){
    return {};
  }

  constructor(name){
    this._ = Symbol(this.constructor.name);
    this[this._] = {
      name: '',
      value: '',
      options: {},

    };
    this[this._].name = name;
    for(let opt of this.Options) {
      let option = this.Options[opt];
      let target = new option.option();
      if(typeof option.args !== "undefined"){
        for(let arg of option.args){
          target[arg] = option.args[arg];
        }
      }
      this[this._].options[opt] = target;
    }
  }

  set value(value){
    this[this._].value = value;
  }

  get value(){
    return this[this._].value;
  }

  set required(required){
    if(typeof this[this._].options.required){
      this.getOption("required").is = required;
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