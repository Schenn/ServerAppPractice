const Option = require("./Option");

module.exports = class Size extends Option {

  min = 0;
  max = 0;
  useLength = false;

  isValid(value) {
    if(typeof value === "undefined"){
      return !(this.min > 0 || this.max > 0);
    }
    let size = (typeof value === "number") ?
        value :
        value.length;

    if (this.min > 0 && size < this.min) {
      return false;
    }
    return !(this.max > 0 && size > this.max);
  }

  asAttribute(){
    let minAtt = this.useLength ? "minLength" : "min";
    let maxAtt = this.useLength ? "maxLength" : "max";
    return `
      ${this.min > 0 ? `${minAtt}="${this.min}"` : ''}
      ${this.max > 0 ? `${maxAtt}="${this.max}"` : ''}
    `;
  }
};