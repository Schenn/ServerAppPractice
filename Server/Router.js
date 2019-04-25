const cleanRegex = /^\/+|\/+$/g;
const path = require("path");
const Response = require("./Response");

const _ = Symbol("private");

/**
 * Handle redirecting routes to class methods.
 *
 * @type {Router}
 */
module.exports = class Router {
  constructor(){
    this[_] = {
      routes:{}
    };
  }

  /**
   * Add a route to the router.
   *
   * @param {Route} route
   */
  addRoute(route){
    let cleanPath = route.routePath.replace(cleanRegex, '');
    if(cleanPath === ''){
      cleanPath = "/";
    }
    let routePath = `${route.httpMethod}::${cleanPath}`;
    this[_].routes[routePath] = route;
  }

  /**
   * Add a collection of routes to the routemaps.
   *
   * @param {array} routes
   */
  addRoutes(routes){
    for(let route in routes){
      this.addRoute(routes[route]);
    }
  }

  /**
   * Get the data object for a given route.
   *
   * @param {Request} req The request object.
   * @return {Object}
   */
  routeMeta(req){
    let cleanPath = req.path.replace(cleanRegex, '');
    if(cleanPath === ''){
      cleanPath = "/";
    }
    let path = `${req.httpMethod}::${cleanPath}`;
    return this[_].routes[path] ?
      this[_].routes[path] :
      null;
  }

  /**
   * Get the controller for the given path and trigger the matching route handler.
   *
   * @param {Request} req
   * @param {Response} res
   */
  handle(req, res) {
    let route = this.routeMeta(req);
    if (route == null) {
      res.statusCode = 404;
    } else {
      route.validateRequest(req);
      route.handle(req, res);
    }
    res.close();
  }
};

