/**
 * @DBX/Table {user_auth}
 * @DBX/Table {hash_words} {hash:{type:varchar, length:350}}
 * @DBX/Table {salts} {salt:{type:varchar, length:350}}
 * @DBX/Table {rounds} {rounds:{type:tinyint}}
 */
class UserAuth {
  #username = '';
  #hashedPass = '';
  #salt = '';
  #pepper = '';

  /**
   * @DBX/Column {varchar} length=50
   */
  get userName(){
    return this.#username;
  }

  /**
   * @DBX/OneToOne {hash_words} {hash_id:id}
   */
  get hashedPass(){
    return this.#hashedPass;
  }

  /**
   * @DBX/OneToOne {salts} {hash_words.salt_id:salts.id}
   */
  get salt(){
    return this.#salt;
  }

  /**
   * @DBX/OneToOne {rounds} {salts.rounds_id:rounds.id}
   */
  get pepper(){
    return this.#pepper;
  }
}

return UserAuth;