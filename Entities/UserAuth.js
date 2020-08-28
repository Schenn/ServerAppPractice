const Entity = require("../Database/Entity");
/**
 * @DBX/Entity
 * @DBX/Component {HashWords}
 * @DBX/Component {Salts}
 * @DBX/Component {Rounds}
 */
class UserAuth extends Entity{
  #username = '';

  constructor({username = '', ...data}) {
    this.#username = username;
    super(data);
  }

  /**
   * @DBX/Column {varchar} length=50
   */
  get userName(){
    return this.#username;
  }

  set password(password){
    this.setComponentProperty("HashWords", "password", password);
  }

  create(){
    // Try to select the user, if it exists, reject.

    // Otherwise, insert
  }
}

return UserAuth;