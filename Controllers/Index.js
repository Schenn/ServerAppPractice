const Controller = require("./Controller");

/**
 * @classRoute /
 * @type {Index}
 */
module.exports = class Index extends Controller {
  /**
   * @route /
   *
   * @param data
   * @param cb
   */
  index(req, res){
    res.content = "index index index index";
  }
};