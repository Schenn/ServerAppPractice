module.exports = class Entity {
  constructor(){
    this._ = Symbol(this.constructor.name);
    this[this._] = {};
  }

  initFields(fields){
    this[this._] = fields;
  }

  getField(field){
    return this[this._][field];
  }

  isValid(){
    let valid = true;
    for(let field of this[this._]){
      valid = this[this._][field].isValid();
      if(!valid){
        break;
      }
    }
    return valid;
  }

  data(){
    let data = {};
    for(let field of this[this._]){
      data[field] = this[this._][field].value;
    }
    return data;
  }
};