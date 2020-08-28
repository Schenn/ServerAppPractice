
module.exports = class Form {

  payload = "";
  #fields = new Map();
  #invalidFlags = {};
  action = "";
  method = "";
  id = "";
  name = "";

  /**
   * @param payload Post data.
   */
  constructor(data){
    this.payload = data;
  }

  /**
   * Add a field and a list of validators to run against the field value.
   *
   * @param {string} fieldName
   * @param {module.Field} field
   * @return {module.Form}
   */
  addField(fieldName, field){
    this.#fields.set(fieldName, field);
    return this;
  }

  getField(field){
    return this.payload[field];
  }


  get Model(){
    return null;
  }

  isValid(){
    let valid = true;
    this.#invalidFlags = {};
    for(let [fieldName, field] of this.#fields){
      field.value = this.payload[fieldName];
      if(!field.isValid()){
        valid = false;
        this.#invalidFlags[fieldName] = `${fieldName} validator - failed with value: ${this.payload[fieldName]}`;
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
    let formHTML = `
      <form action="${this.action}" method="${this.method}" id="${this.name}" name="${this.name}">
        <fieldset>
        ${Array.from(this.#fields.values()).map((field)=>{
          return `${field.labelHtml} ${field.html}`
        }).join('')}
        </fieldset>
        <input type="submit"/>
      </form>
      <script>
        document.querySelector('#${this.name}').addEventListener('submit', ${this.formHandler()});
      </script>
    `;
    return formHTML;
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