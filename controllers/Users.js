const Controller = require ("../lib/Controller");
const Writer = require("../lib/Writer");

/**
 * @classRoute="u"
 * @type {module.Users}
 */
module.exports = class Users extends Controller {

  /**
   * @route='/'
   * @param data (should be empty)
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
    let firstName = typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length > 0 ?
        data.payload.firstName.trim() : false;
    let lastName = typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length > 0 ?
        data.payload.lastName.trim() : false;
    let username = typeof data.payload.userName === 'string' && data.payload.userName.trim().length > 0 ?
        data.payload.userName.trim() : false;
    let tos = typeof data.payload.tos === 'boolean' && data.payload.tos === true;

    if(!firstName || !lastName || !username || !tos){
      cb(400, {'Error' : 'Missing Required Fields.'});
    } else {
      // Make sure user doesn't already exist.
      let writer = new Writer();
      writer.read('users', phone, (err, data)=>{
        if(err){
          // user doesn't exist. Create.
          // hash the pass.
          
        } else {
          cb(400, {"Error": "A user with that phone number exists."})
        }
      });
      // Create a new user data object
      // Save it to the DB
    }
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