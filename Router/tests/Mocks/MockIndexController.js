const Controller = require("../../../Controllers/Controller");

/**
 * @classRoute /
 * @type {MockIndexController}
 */
module.exports = class MockIndexController extends Controller {
  /**
   * @route /
   *
   * @param data
   * @param cb
   */
  testIndex(req, res){
    req.hit = true;
    res.content = "index index index index";
  }

  /**
   * @route save
   * @httpMethod post
   * @json
   * @param req
   * @param res
   */
  testSave(req, res){
    req.hit = true;
    res.content = {'test':'test'};
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
   * @doBefore doThing
   * @param req
   * @param res
   */
  testDelete(req, res){
    req.hit = true;
  }

  /**
   * @param req
   * @param res
   */
  doThing(req, res){
    req.doBefore = true;
  }
};