const TextField = require("./TextField");
const crypto = require("crypto");

const secret = "foo";

module.exports = class HashField extends TextField{
  get value(){
    let value = super.value;
    if(value.length === 0){
      return false;
    }
    return crypto.createHmac('sha256', secret).update(value).digest('hex');
  }
};