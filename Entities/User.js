const _ = Symbol("private");

/**
 * @type {module.User}
 */
module.exports = class User {

  constructor({userName='', email='', password=''}){
    this[_] = {
      userName: userName,
      email:  email,
      password: password,
    };
  }

  /**
   * @return {string}
   */
  get userName(){
    return this[_].userName;
  }

  /**
   * @param {string} name
   */
  set userName(name){
    this[_].userName = name;
  }

  /**
   * @return {string}
   */
  get email(){
    return this[_].email;
  }

  /**
   * @param {string} username
   */
  set phone(email){
    this[_].email = email;
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