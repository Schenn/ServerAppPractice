class Component {
  #name = "";
  #onPropChange = null;
  #entity = null;
  #initializing = true;

  constructor(entity, onPropChange=()=>{}){
    this.#entity = entity;
    this.#onPropChange = onPropChange;
  }


}

module.exports = Component;