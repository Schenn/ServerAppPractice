const _ = Symbol("private");
module.exports = class Form {
  /**
   * @param payload Post data.
   */
  constructor(payload){
    this[_] = {
      payload: payload,
      fields: new Map(),
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
    this[_].fields.set(field, validators);

    return this;
  }

  payload(){
    return this[_].payload;
  }

  getField(field){
    return this[_].payload[field];
  }

  get Model(){
    throw "Abstract Method Needs Override!";
  }

  isValid(){
    let valid = true;
    this[_].invalidFlags = {};
    for(let [field, validators] of this[_].fields){
      for(let validator of validators){
        validator.value = this[_].payload[field];
        if(!validator.isValid()){
          valid = false;
          if(typeof this[_].invalidFlags[field] === "undefined"){
            this[_].invalidFlags[field] = [];
          }
          this[_].invalidFlags[field].push(`${field} validator - failed with value: ${this[_].payload[field]}`);
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
  template(){
    return '';
  }

  formHandler(){
    return ((e) =>{
      e.preventDefault();
      e.stopPropagation();
      let form = e.target;
      let formData = new FormData(form);
      fetch(form.getAttribute("action"), {
        method: form.getAttribute("method"),
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      }).then((response)=>{return response.json()}).then((data) => {
        console.log(data);
      });
      return false;
    }).toString();
  }
};