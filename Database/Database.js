const _ = Symbol("private");

/**
 * Abstract Database class to standardize your databases interactions with the rest of the code base.
 *
 * @type {Database}
 */
class Database {

  #connArgs = {};
  #connection = null;
  #errors = [];

  /**
   *
   * @param {}connectionArgs
   */
  constructor(connectionArgs){
    this.#connArgs = connectionArgs;
  }

  get connection(){
    return this.#connection;
  }

  get errors(){
    return this.#errors;
  }

  addError(err){
    this.#errors.push(err);
    console.log(err);
  }

  /**
   * Get the value for a connection parameter.
   * @param name
   * @return {string}
   */
  connectionParam(name){
    if(!this.#connArgs){
      this.addError("No Connection arguments passed to Database.");
    }

    if(typeof this.#connArgs[name] === "undefined"){
      this.addError(`${name} is not a property in the database connection arguments.`);
    }

    return this.#connArgs[name];
  }

  /**
   * Connect to the DB instance to do work.
   * @abstract
   * @param {function} cb Callback
   * @param {object} fixtures Data fixtures to install on the first connection to the db.
   */
  connect(cb, fixtures={}){
    throw "Abstract method connect called.  Needs override.";
  }

  /**
   * Execute a database query
   * @param {string | object} query
   * @abstract
   * @param {function} cb Callback
   */
  query(query, cb){
    throw "Abstract method Query called. Needs override."
  }

  /**
   * Get data from the db
   * @param selectArgs
   * @param cb
   */
  select(selectArgs, cb){
    throw "Abstract method select called. Needs override.";
  }

  insert(insertArgs, cb){
    throw "Abstract method insert called. Needs override.";
  }

  update(updateArgs, cb){
    throw "Abstract method update called. Needs override.";
  }

  delete(deleteArgs, cb){
    throw "Abstract method delete called. Needs override.";
  }

  /**
   * Close any connections to the DB Instance.
   * @abstract
   * @param {function} cb Callback
   */
  disconnect(cb){
    throw "Abstract method Disconnect called. Needs override."
  }

  initialize(fixtures, cb){
    throw "Abstract method initialize called. Needs override."
  }
}

module.exports = Database;