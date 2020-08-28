const Component = require("../../Database/Component");

/**
 * @DBX/Component
 */
class Rounds extends Component {
  #roundCount = -1;

  /**
   * @DBX/Column {tinyint}
   */
  get rounds(){
    if(this.#roundCount === -1){
      this.#roundCount = Math.floor(Math.random() * 100) + 1;
    }
    return this.#roundCount;
  }

  constructor({rounds = -1, ...data}) {
    super(data);
    this.#roundCount = rounds;
  }

}