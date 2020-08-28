const Option = require("./Option");

module.exports = class Pattern extends Option {
  pattern = null;

  isValid(value){
    // no pattern to match, so its ok.
    return (this.pattern === null) ? true :
      this.pattern.test(value);
  }

  asAttribute(){
    let pattern = this.pattern ? this.pattern.toString() : null;
    return `${pattern ? `pattern=${pattern.substring(1, pattern.length-1)}` : ''}`;
  }
};