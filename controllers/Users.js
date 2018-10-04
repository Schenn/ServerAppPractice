const Controller = require ("../lib/Controller");

/**
 * @classRoute="u"
 * @type {module.Users}
 */
module.exports = class Users extends Controller {

  /**
   * @route='/'
   * @param cb
   */
  index(data, cb){
    cb(200, "Success Yo");
  }

  /**
   * @route='create'
   * @method='post'
   *
   * @param data
   * @param cb
   */
  create(data, cb){

  }

  /**
   * @route='update'
   * @method='put'
   *
   * @param data
   * @param cb
   */
  update(data, cb){

  }

  /**
   * @route='delete'
   * @method='delete'
   * @param data
   * @param cb
   */
  delete(data, cb){

  }

};