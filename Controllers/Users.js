const Controller = require('../Server/Controller');
const Writer = require('../lib/Writer');
const User = require('../Entities_old/User');

/**
 * @classRoute u
 * @type {Users}
 */
module.exports = class Users extends Controller {

  /**
   * @route /
   * @param {object} data (should be empty)
   * @param cb
   */
  index(data, cb) {
    cb(this.createResponse(200, 'Success Yo'));
  }

  validateUser(req, res){

  }

  /**
   * @route create
   * @httpMethod post
   * @model Entities/User
   * @doBefore validateUser
   */
  create(req, res) {
    let tos = req.payload.tos;
    if (!req.model.isValid() || !tos) {
      res.error(400, 'Missing Required Fields');
    } else {
      // Make sure user doesn't already exist.
      let writer = new Writer();
      writer.read('users', phone, (err, data) => {
        if (err) {
          // user doesn't exist. Create.
          let user = new User();
          user.firstName = firstName;
          user.lastName = lastName;
          user.username = username;
          user.tos = tos;
          user.password = 'monkey';

          // Save it to the 'DB'
          if (user.isValid()) {
            let data = user.data();

          }
        } else {
          cb(this.createResponse(400, {'Error': 'A user with that phone number exists.'}));
        }
      });

    }
  }

  /**
   * @route update
   * @method put
   *
   * @param data
   * @param cb
   */
  update(data, cb) {

  }

  /**
   * @route delete
   * @method delete
   * @param data
   * @param cb
   */
  delete(data, cb) {

  }

};