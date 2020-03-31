const _ = Symbol("private");
module.exports = class Form {

  #payload = "";
  #fields = new Map();
  #invalidFlags = {};

  /**
   * @param payload Post data.
   */
  constructor(payload){
    this.#payload = payload;
  }

  /**
   * Add a field and a list of validators to run against the field value.
   *
   * @param {string} field
   * @param {module.Field[]} validators
   * @return {module.Form}
   */
  addField(field, validators){
    this.#fields.set(field, validators);
    return this;
  }

  get payload(){
    return this.#payload;
  }

  getField(field){
    return this.#payload[field];
  }

  get Model(){
    throw "Abstract Method Needs Override!";
  }

  isValid(){
    let valid = true;
    this.#invalidFlags = {};
    for(let [field, validators] of this.#fields){
      for(let validator of validators){
        validator.value = this.#payload[field];
        if(!validator.isValid()){
          valid = false;
          if(typeof this.#invalidFlags[field] === "undefined"){
            this.#invalidFlags[field] = [];
          }
          this.#invalidFlags[field].push(`${field} validator - failed with value: ${this.#payload[field]}`);
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
    return this.#invalidFlags;
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