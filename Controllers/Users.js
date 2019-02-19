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
    cb(200, 'Success Yo');
  }

  /**
   * @route create
   * @method post
   * @entity User
   *
   * @param data
   * @param cb
   */
  create(data, cb) {
    let firstName = typeof data.payload.firstName === 'string' ?
        data.payload.firstName.trim() : false;
    let lastName = typeof data.payload.lastName === 'string' ?
        data.payload.lastName.trim() : false;
    let username = typeof data.payload.userName === 'string' ?
        data.payload.userName.trim() : false;
    let tos = typeof data.payload.tos === 'boolean' && data.payload.tos ===
        true;

    if (!firstName || !lastName || !username || !tos) {
      cb(400, {'Error': 'Missing Required Fields.'});
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
          cb(400, {'Error': 'A user with that phone number exists.'});
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