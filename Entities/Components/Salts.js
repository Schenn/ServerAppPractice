const Component = require("../../Database/Component");

const chars= ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
/**
 * Generate salts
 * @DBX/Component
 */
class Salts extends Component {
  #salt = '';

  constructor({salt, ...data}) {
    super(data);
    this.#salt = salt;
  }

  /**
   * @DBX/Column {varchar} {length:350}
   */
  get salt(){
    return this.#salt;
  }

  /**
   * Create a semi-random string to use as a salt.
   */
  generate(){
    let saltLength = Math.floor(Math.random() * 24) + 12;
    for(let i=0; i<saltLength; i++){
      let rndDigit = Math.floor(Math.random() * 12);
      let char = '';
      if(rndDigit <= 3){
        char = Math.floor(Math.random() * 10); //use a number
      } else if(rndDigit > 3 && rndDigit <= 7){
        char = chars[Math.floor(Math.random() * 26)];
      } else {
        char = chars[Math.floor(Math.random() * 26)].toUpperCase();
      }
      this.#salt += char;
    }
    return this.#salt;
  }
}

