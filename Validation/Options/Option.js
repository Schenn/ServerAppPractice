module.exports = class Option {
  isValid(value){
    throw "Abstract method Option::isValid called";
  }
};