const Controller = require("../../Controller");

/**
 * @classRoute /
 * @type {MockController}
 */
module.exports = class MockController extends Controller {
  /**
   * @route /
   *
   * @param data
   * @param cb
   */
  index(req, res){
    res.content = "index index index index";
  }

  /**
   * @route save
   * @httpMethod post
   *
   * @param req
   * @param res
   */
  testPost(req, res){

  }

  /**
   * @route update
   * @httpMethod put
   * @doBefore tests\Mocks\MockHandler::doThing
   *
   * @param req
   * @param res
   */
  testUpdate(req, res){

  }

  /**
   * @route delete
   * @httpMethod delete
   * @doBefore doThing
   * @param req
   * @param res
   */
  testDelete(req, res){

  }

  /**
   * @param req
   * @param res
   */
  doThing(req, res){

  }
};