let _ = Symbol("private");

module.exports = class MockPostModel {
  constructor(reqData){
    this[_] = {
      thing: reqData.payload
    };
  }

  get test(){
    return this[_].thing;
  }
};