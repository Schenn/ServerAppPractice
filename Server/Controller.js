const _ = Symbol("private");
const Response = require("./Response");

/**
 * Controller is the base class used by the server controller classes.
 *
 *  When a request is heard, the path is translated into
 *    /controllername/[function][request method]
 *
 *  For example:  if you Post to "users/create", the "createPost" method for the Users controller will be called.
 *
 *  If there is only one part of the path (e.g. foo), than the app
 *    checks for the corresponding index function on the appropriate controller class.
 *    If there is no controller class, or there is no index function on that controller class, than
 *      the app looks for an index controller, and for a method that applies to path. (/foo - Get)
 *
 *  All Controllers must be inside the Controllers directory
 *
 *  If there are 3 parts to the path, than the first part of the path is a subdirectory of the Controllers directory.
 *    So if you have multiple Controllers for a particular service, you can collect them in subdirectories.
 *
 *
 *  Inspired by the Symfony framework.
 *
 * @type {Controller}
 */
module.exports = class Controller {

  constructor() {
    this[_] = {
      onRoutePost = {}
    };
  }

  createResponse(status = 200, payload = '', headers = []){
    return new Response(status, payload, headers);
  }

  /**
   * Add a callback which takes the post data and does work to it before the payload reaches the destination route.
   *  e.g. Data validation, field adjustments, db lookups
   * @param {string} route
   * @param {function} onPostCb
   */
  routePayload(route, onPostCb){
    this[_].routePayload[route] = onPostCb;
  }

  /**
   * Get the payload for a post/put/delete request
   *  If no callback is set, then the data is untouched.
   *
   * @param route
   * @param postData
   * @return {*}
   */
  getRoutePayload(route, postData){
    let cb;
    if(typeof this[_].routePayload[route] !== "undefined") {
      cb = this[_].routePayload[route];
    } else {
      cb = (postData)=>{
        return postData;
      };
    }
    return cb(postData);
  }
};