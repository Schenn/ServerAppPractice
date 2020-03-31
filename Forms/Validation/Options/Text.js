const Option = require("./Option");

module.exports = class Text extends Option {
  pattern = null;

  isValid(value){
    // no pattern to match, so its ok.
    return (this.pattern === null) ? true :
      this.pattern.test(value);
  }
};