const Field = require("./Field");
const Options = require("./Options");

const FieldOpts = {
  "length": {option: Options.Size},
  "type": {option: Options.Text}
};

module.exports = class TextField extends Field{

  constructor(){
    super();
    this.initOptions(FieldOpts);
    this.required = true;
  }

  set maxLength(maxLength){
    this.getOption("length").max = maxLength;
  }

  set minLength(minLength){
    this.getOption("length").min = minLength;
  }

  set pattern(pattern){
    this.getOption("type").pattern = pattern;
  }

  get html(){
    let length = this.getOption("length");
    let textType = this.getOption("type");
    return `<label for="${this.name}">${this.label}</label>
             <input type="text" name="${this.name}" 
      ${length.max ? `maxlength="${length.max}"` : '' }
      ${length.min ? `minlength="${length.min}"` : '' }
      ${textType.pattern ? `pattern=${textType.pattern.substring(1, pattern.length-1)}` : ''}
    />`;
  }
};