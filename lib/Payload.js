module.exports = class Payload {

  constructor(){
    this._ = Symbol("Payload");
    this[this._] = {
      props: {},
      payload: {}
    };
  }

  set payload(data){
    this[this._].payload = data;
  }

  iaValid(){

  }

  addProperty(prop, validators){
    this[this._].props[prop] = validators;
  }

  get data(){

  }

};