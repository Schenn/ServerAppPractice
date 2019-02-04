const Controller = require("../lib/Controller");

/**
 * @classRoute /
 * @type {module.Index}
 */
module.exports = class Index extends Controller {
  /**
   * @route /
   *
   * @param data
   * @param cb
   */
  index(data, cb){
    cb(200, "Index index index index");
  }
};