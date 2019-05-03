/**
 * @classRoute other
 * @type {MockOtherController}
 */
module.exports = class MockOtherController {
  /**
   * @route /
   *
   * @param data
   * @param cb
   */
  testIndex(req, res){
    res.content = "index index index index";
    req.hit = true;
  }

  /**
   * @route save
   * @httpMethod post
   *
   * @model Mocks\MockPostModel
   * @param req
   * @param res
   */
  testSave(req, res){
    req.hit = true;
    res.content = req.model.test;
  }

  /**
   * @route update
   * @httpMethod put
   * @doBefore Mocks\MockHandler::doThing
   *
   * @param req
   * @param res
   */
  testUpdate(req, res){
    req.hit = true;
  }

  /**
   * @route delete
   * @httpMethod delete
   * @doBefore Mocks\MockHandler::doThing
   * @param req
   * @param res
   */
  testDelete(req, res){
    req.hit = true;
  }

};