module.exports = class Payload {

  constructor(bufferData){
    this._ = Symbol("Payload");
    this[this._] = {
      path: '',
      method: '',
      query: '',
      headers: '',
      props: {},
      payload: bufferData
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