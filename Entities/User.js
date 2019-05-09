const _ = Symbol("private");

/**
 * @type {module.User}
 */
module.exports = class User {

  constructor(payload){
    this[_] = {
      firstName: '',
      lastName: '',
      phone:  '',
      password: '',
    };
  }

  /**
   * @return {string}
   */
  get firstName(){
    return this[_].firstName;
  }

  /**
   * @param {string} name
   */
  set firstName(name){
    this[_].firstName = name;
  }

  /**
   * @return {string}
   */
  get lastName(){
    return this[_].lastName;
  }

  /**
   * @param {string} name
   */
  set lastName(name){
    this[_].lastName = name;
  }

  /**
   * @return {string}
   */
  get phone(){
    return this[_].phone;
  }

  /**
   * @param {string} username
   */
  set phone(phone){
    this[_].phone = phone;
  }

  /**
   * @return {string}
   */
  get password(){
    return this[_].password;
  }

  /**
   * @param {string} password
   */
  set password(password){
    this[_].password = password;
  }
};