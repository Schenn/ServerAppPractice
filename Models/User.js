/**
 * @type {User}
 */
class User {

  userName = "";
  #email = "";
  #password = "";

  constructor({userName='', email='', password=''}){
    this.userName = userName;
    this.#email = email;
    this.#password = password;
  }

  /**
   * @return {string}
   */
  get email(){
    return this.#email;
  }

  /**
   * @return {string}
   */
  get password(){
    return this.#password;
  }

  /**
   * @param {string} password
   */
  set password(password){
    this.#password = password;
  }
}

module.exports = User;