const Controller = require('../Server/Controller');
const User = require('../Entities/User');

/**
 * @classRoute u
 * @type {Users}
 */
module.exports = class Users extends Controller {

  /**
   * @route /
   * @depends {Forms/NewUser} newuserform
   * @param {module.Request} req
   * @param {module.Response} res
   */
  index(req, res, {newuserform}) {
    let html = `<html><head></head><body>${newuserform.template()}</body></html>`;
    res.content = `${html}`;
  }

  /**
   * @route create
   * @httpMethod post
   * @json
   * @depends {Forms/NewUser} newuserform
   * @param {module.Request} req
   * @param {module.Response} res
   */
  create(req, res, {newuserform}) {
    if(!newuserform.isValid()) {
      this.error(req, res, newuserform);
    } else {
      let user = newuserform.Model;
      // Make sure user doesn't already exist.

      // If the user exists, update the entry

      // Otherwise, create it.
      console.log("Save the user!");

    }
  }

  /**
   * @route update
   * @httpMethod put
   *
   * @param req
   * @param res
   */
  update(req, res) {

  }

  /**
   * @route delete
   * @httpMethod delete
   * @param req
   * @param res
   */
  delete(req, res) {

  }

};