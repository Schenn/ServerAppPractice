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
 *  All controllers must be inside the controllers directory
 *
 *  If there are 3 parts to the path, than the first part of the path is a subdirectory of the controllers directory.
 *    So if you have multiple controllers for a particular service, you can collect them in subdirectories.
 *
 *
 *  Inspired by the Symfony framework.
 *
 * @type {module.Controller}
 */
module.exports = class Controller {

  constructor() {
    this._ = Symbol("controller");
    this[this._] = {
    };
  }
};