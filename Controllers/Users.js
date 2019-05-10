const Controller = require('../Server/Controller');
const Writer = require('../lib/Writer');
const User = require('../Entities/User');

/**
 * @classRoute u
 * @type {Users}
 */
module.exports = class Users extends Controller {

  /**
   * @route /
   * @param {module.Request} req
   * @param {module.Response} res
   */
  index(req, res) {
    res.content = "Success Yo";
  }

  /**
   * @route create
   * @httpMethod post
   * @form Forms/NewUser
   * @param {module.Request} req
   * @param {module.Response} res
   */
  create(req, res) {
    if(!req.form.isValid()) {
      res.content = JSON.stringify(req.form.errors);
      res.error(400, 'Missing Required Fields');
    } else {
      let user = req.form.getEntity();
      // Make sure user doesn't already exist.
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