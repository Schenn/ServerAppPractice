const _ = Symbol("private");
module.exports = class Form {
  /**
   * @param payload Post data.
   */
  constructor(payload){
    this[_] = {
      payload: payload,
      fields: {},
      invalidFlags: {}
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

  getEntities(){
    throw "Abstract Method Needs Override!";
  }

  isValid(){
    let valid = true;
    this[_].invalidFlags = [];
    for(let field in this[_].fields){
      let validators = this[_].fields[field];
      for(let validator of validators){
        validator.value = this[_].payload[field];
        // IF YOU ARE OVERRIDING THIS METHOD --
        //  The validator options throw an error when the provided value fails.
        // Get all failed validators. Could also break on error to stop at first failure.
        if(!validator.isValid()){
          valid = false;
          if(typeof this[_].invalidFlags[field] === "undefined"){
            this[_].invalidFlags[field] = [];
          }
          this[_].invalidFlags[field].push(`${field} has invalid value: ${this[_].payload[field]}`);
          break;
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
    console.log(this[_].invalidFlags);
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