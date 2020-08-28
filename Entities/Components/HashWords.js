const crypto = require("crypto");

const Component = require("../../Database/Component");

/**
 * Generate hashes
 * @DBX/Component
 */
class HashWords extends Component {

  #hashWord = '';
  #secret = "foo";
  #algo = "sha256";
  #encoding = "hex";

  constructor({hashWord='', ...data}) {
    super(data);
    this.#hashWord = hashWord;
  }

  /**
   * @DBX/Column {varchar} {length=350}
   */
  get hashWord(){
    return this.#hashWord;
  }

  set secret(secret){
    this.#secret = secret;
  }

  saltAndPepper(plainPassword, salt, rounds=1){
    salt = crypto.createHmac(this.#algo, this.#secret).update(salt).digest(this.#encoding);
    this.#hashWord = crypto.createHmac(this.#algo, this.#secret).update(`${plainPassword}${salt}`).digest(this.#encoding);
    for(let i =0; i < rounds; i++){
      this.#hashWord = crypto.createHmac(this.#algo, this.#secret).update(`${hash}${salt}`).digest(this.#encoding);
    }
  }
}

module.exports = HashWords;