class Component {
  #name = "";
  #id = -1;

  get id(){
    return this.#id;
  }

  constructor({id=-1}) {
    this.#id = id;
  }

}

module.exports = Component;