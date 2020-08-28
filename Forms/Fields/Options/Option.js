module.exports = class Option {
  error = '';

  asAttribute(){
    throw "Abstract method Option::asAttribute called";
  }

  isValid(value){
    throw "Abstract method Option::isValid called";
  }
};