module.exports = class MockHandler{
  doThing(req, res){
    req.doBefore = true;
  }
};