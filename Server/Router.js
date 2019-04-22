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
  constructor(controllerPath = 'Controllers'){
    this[_] = {
      routes:{}
    };
  }

  addRoute(route){
    let httpMethods = route.httpMethod;
    if(httpMethods instanceof Array){
      for(let method of httpMethods){
        let routePath = `${method}::${route.routePath.replace(cleanRegex, '')}`;
        this[_].routes[routePath] = route;
      }
    } else {
      let routePath = `${httpMethods}::${route.routePath.replace(cleanRegex, '')}`;
      this[_].routes[routePath] = route;
    }
  }

  /**
   * Add a collection of routes to the routemaps.
   *
   * @param {array} routes
   *
   */
  addRoutes(routes){
    for(let route in routes){
      this.addRoute(routes[route]);
    }
  }

  /**
   * Get the data object for a given route.
   *
   * @return {Object}
   */
  routeMeta(req){
    let method = req.httpMethod;
    let path = `${method}::${req.path}`;
    return this[_].routes[path] ?
      this[_].routes[path] :
      null;
  }

  /**
   * Get the controller for the given path and trigger the matching route handler.
   *
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

