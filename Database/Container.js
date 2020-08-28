const Entity = require("Entity");

class Container extends Entity {
  #entities = new WeakMap();

  get entities(){
    return this.#entities.values();
  }

  attachEntity(entity, alias=''){
    this.#entities.set(alias !== '' ? alias : entity.name, entity);
  }

  broadcast(funcName, args) {
    // for each entity - broadcast

  }

  getEntity(name){
    return this.#entities.get(name);
  }
}

module.exports = Entity;