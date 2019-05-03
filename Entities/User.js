
module.exports = class User {

  constructor(){
    this._ = Symbol("user");
    this[this._] = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
    };
  }

  /**
   * @return {string}
   */
  get firstName(){
    return this[this._].firstName;
  }

  /**
   * @validator {TextField} required
   * @param {string} name
   */
  set firstName(name){
    this[this._].firstName = name;
  }

  /**
   * @return {string}
   */
  get lastName(){
    return this[this._].lastName;
  }

  /**
   * @validator {TextField} required
   * @param {string} name
   */
  set lastName(name){
    this[this._].lastName = name;
  }

  /**
   * @return {string}
   */
  get username(){
    return this[this._].username;
  }

  /**
   * @validator {TextField} required
   * @db:constraint unique
   *
   * @param {string} username
   */
  set username(username){
    this[this._].username = name;
  }

  /**
   * @return {string}
   */
  get password(){
    return this[this._].password;
  }

  /**
   * @field hash
   * @validator {HashField} required
   * @param {string} password
   */
  set password(password){
    this[this._].password = password;
  }

  isValid(){
    return false;
  }
};