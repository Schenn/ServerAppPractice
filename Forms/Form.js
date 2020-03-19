const _ = Symbol("private");
module.exports = class Form {
  /**
   * @param payload Post data.
   */
  constructor(payload){
    this[_] = {
      payload: payload,
      fields: {},
      invalidFlags: {},
    };
  }

  /**
   * Add a field and a list of validators to run against the field value.
   *
   * @param {string} field
   * @param {module.Field[]} validators
   * @return {module.Form}
   */
  addField(field, validators){
    this[_].fields[field] = validators;

    return this;
  }

  getField(field){
    return this[_].payload[field];
  }

  getModel(){
    throw "Abstract Method Needs Override!";
  }

  isValid(){
    let valid = true;
    this[_].invalidFlags = [];
    for(let field in this[_].fields){
      let validators = this[_].fields[field];
      for(let validator of validators){
        validator.value = this[_].payload[field];
        if(!validator.isValid()){
          valid = false;
          if(typeof this[_].invalidFlags[field] === "undefined"){
            this[_].invalidFlags[field] = [];
          }
          this[_].invalidFlags[field].push(`${field} validator ${validator.name}- failed with value: ${this[_].payload[field]}`);
        }
      }
    }
    return valid;
  }

  /**
   * For reporting to user, logging, etc.
   *
   * @return {invalidFlags|{}|Array}
   */
  get errors(){
    return this[_].invalidFlags;
  }

  /**
   * The html template to use to render the form for the client.
   *
   * @return {string}
   */
  getTemplate(){
    return '';
  }
};