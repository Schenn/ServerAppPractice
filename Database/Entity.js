const EntityManager = require("EntityManager");
/**
 * Entity is the master wrapper for the components it contains
 * The components it contains may vary over time.
 * The components are responsible for saving any internal data
 * But the Entity class should be responsible for the data that the Entity handles and should not depend on the
 *  components being static forever but being replaceable. e.g. Don't depend on component properties,
 *    depend on component methods. Let components handle whatever internal saving that needs to be saved.
 *
 * A container is an Entity that contains other Entities.
 *  This means containers can and should have their own entities and components for doing the work
 *  A container's collection of Entities may change over time
 *
 *  In order to allow the mutability of containers and entities, a fingerprint will be created for the class.
 *    That fingerprint will be used to archive data for containers and entities,
 *      and allow you to create backwards-compatibility handlers based off that fingerprint.
 *
 *
 *  A saved Entity will look like this
 *    (WORK IN PROGRESS)
 *
 * https://tdwi.org/articles/2019/05/13/dwt-all-combining-sql-and-nosql-information-context.aspx
 * https://www.thereformedprogrammer.net/ef-core-combining-sql-and-nosql-databases-for-better-performance/
 *
 */
class Entity {
  static #manager = EntityManager;
  #id = -1;
  #name = '';
  #components = new WeakMap();
  #events = new WeakMap();

  /**
   * @DBX/Column {int}
   * @DBX/PrimaryKey
   * @return {number}
   */
  get id(){
    return this.#id;
  }

  get name(){
    return this.#name;
  }

  constructor(name = ""){
    this.#name = name ? name : new.target.constructor.name;
  }

  /**
   * A component is a standalone block of functionality that needs to store its own data.
   *  Joined on one-to-many tables using class names or aliases as the table name.
   *  Uses "id" as the primary key. Joins are done on ids
   *  An Entity communicates with the component via "messaging" methods and event handlers.
   *
   * @param component
   */
  attachComponent(component, alias=''){
    // Names come from the component property getter "name".
    //  Give your components a unique name. If you need to use multiple instances of the same component type,
    //    than you can provide an alias to reference the specific component by.
    let name = (alias !== '') ? alias :
      component.name ? component.name : component.constructor.name;
    if(this.hasComponent(name)){
      throw `Component with name: ${name} already exists on entity: ${this.#name}`;
    }
    this.#components.set(name, component);
  }

  /**
   * Does this Entity have a component or entity with the given name
   * @param name
   */
  hasComponent(name){
    return this.#components.has(name);
  }

  getComponent(name){
    return this.#components.get(name);
  }

  get components(){
    return this.#components.values();
  }

  /**
   * Ask every attached component to run a given method with the provided arguments
   *
   *  Broadcasts are one way. You will not get anything back.
   * @param funcName
   * @param args
   */
  broadcast(funcName, args){
    for(let {name,component} of this.#components){
      if(typeof component[funcName] === "function"){
        component[funcName](args);
      }
    }
  }

  /**
   * Ask a specific component to run a given method with the provided arguments.
   *
   * @param componentName
   * @param funcName
   * @param args
   */
  message(componentName, funcName, args){
    this.#components.get(componentName)[funcName](args);
  }

  /**
   * Get a piece of data from a component. The component must have a property or a method that returns a value.
   *
   * @param componentName
   * @param funcName
   * @param args
   */
  getFromComponent(componentName, funcName, args=undefined){
    return this.#components.get(componentName)[funcName](args);
  }

  /**
   * Set a property on a component.
   *
   *
   * @param componentName
   * @param propName
   * @param value
   */
  setComponentProperty(componentName, propName, value){
    this.#components.get(componentName)[propName] = value;
  }

  onEvent(eventName, eventHandler){
    this.addEventListener(eventName, eventHandler);
  }

  save(){

  }

  load(){

  }

  delete(){

  }
}

module.exports = Entity;