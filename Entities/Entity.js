module.exports = class Entity {
  constructor(payload){
    this._ = Symbol(this.constructor.name);
    this[this._] = {};
  }

  initFields(fields){
    this[this._] = fields;
  }

  getField(field){
    return this[this._][field];
  }
};