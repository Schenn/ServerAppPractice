const cleanRegex = /^\/+|\/+$/g;
const path = require("path");

const _ = Symbol("private");

/**
 * Handle redirecting routes to class methods.
 *
 * @type {Router}
 * @todo Use Route objects instead of two dictionaries.
 */
module.exports = class Router {
  constructor(controllerPath = 'Controllers'){
    this[_] = {
      httpsRoutes:{},
      httpRoutes:{}
    };
  }

  get httpRoutes(){
    return this[_].httpRoutes
  }

  get httpsRoutes(){
    return this[_].httpsRoutes;
  }

  /**
   * Add a collection of routes to the routemaps.
   *
   * @param {array} routes
   * @param {boolean} https If the route requires a secure connection.
   */
  addRoutes(routes, https=false){
    for(let route in routes){
      if(https){
        this[_].httpsRoutes[route.replace(cleanRegex , '')] = routes[route];
      } else {
        this[_].httpRoutes[route.replace(cleanRegex , '')] = routes[route];
      }
    }
  }

  /**
   * Get the data object for a given route.
   *
   * @param {string} route
   * @param {boolean} https
   * @return {Object}
   */
  routeMeta(route, https=false){
    let routeHandle = null;
    // if the request came from the https connection, check for the https route before checking the httproutes.
    //  http routes can be loaded over https
    if(https && typeof this.httpsRoutes[route] !== "undefined"){
      routeHandle = this.httpsRoutes[route];
    } else if(typeof this.httpRoutes[route] !== "undefined"){
      routeHandle = this.httpRoutes[route];
    }

    return routeHandle;
  }

  /**
   * Validate that the http method used against a given route is allowed.
   *
   * @param {string} route
   * @param {string} method
   * @param {boolean} isSecure
   * @return {{isValid: boolean, message: string}}
   */
  validateRequestMethod(route, method, isSecure=false){
    let routeMeta = this.routeMeta(route, isSecure);

    let error = '';
    let fail = false;
    // Validate request's http method against the path's metadata.
    // if the routeHandle is still null, that's ok, we'll use the notFound method instead.
    if(routeMeta) {
      fail = (routeMeta.methodData.method instanceof Array && !routeMeta.methodData.method.includes(method)) ||
          (routeMeta.methodData.method instanceof String && routeMeta.methodData.method !== method);

      if(fail){
        error = `Heard invalid method for route: ${route} Method Provided: ${method} Methods accepted: ${routeMeta.methodData.method}`;
      }
    }
    return {isValid: !fail, message: error};
  }

  /**
   * Get the controller for the given path and trigger the matching route handler.
   *
   * @param {object} data Server data for the controller to use
   * @param {function} writeResponse Method that writes the response to the user.
   * @param {boolean} https
   */
  handle(data, writeResponse, https=false) {
    let routeMeta = this.routeMeta(data.path, https);
    if (routeMeta != null) {
      let controller = routeMeta.getInstance();
      controller[routeMeta.controllerMethod](data, (status = 200, payload) => {
        let headers = [];
        if (routeMeta.methodData.hasAnnotation("json")) {
          payload = JSON.stringify(payload);
          headers.push({key: 'content-type', value: 'application/json'});
        }
        writeResponse(status, payload, headers);
      });
    } else {
      writeResponse(404);
    }
  }
};

