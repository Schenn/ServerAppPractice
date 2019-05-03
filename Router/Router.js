const cleanRegex = /^\/+|\/+$/g;
const path = require("path");
const Response = require("../Server/Response");
const Collector = require("../NodeAnnotations/Collector");

const _ = Symbol("private");

/**
 * Handle redirecting routes to class methods.
 *
 * @type {Router}
 */
module.exports = class Router extends Collector {
  constructor(){
    super();
    this[_] = {
      routes:{}
    };
  }

  /**
   * Add a route to the router.
   *
   *  The route is memoized as httpMethod::path.
   *    That way multiple methods can each handle a different http method for a given path.
   *    (e.g. GET /create -- controller::renderForm. POST /create -- controller::saveForm.)
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
   * Collect the methods from a controller and memoize any routes found.
   *
   * @param {Object | Metadata} controllerData
   */
  addRoutes(controllerData, namespace){
    if(!controllerData.classDoc.hasAnnotation("classRoute")){
      controllerData.classDoc.annotationFromPhrase(`* @classRoute ${namespace.toLowerCase()}`);
    }

    for(let method of controllerData.methods){
      let methodData = controllerData.forMethod(method);
      if(!methodData.hasAnnotation("route")){
        continue;
      }

      this.addRoute(new Route(controllerData, method));
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
   * Collect the controllers found on a given path and identify the routes that belong to it.
   *
   * @param {String} controllerPath The parent directory for your controllers
   */
  buildCache(controllerPath){
    this.on("fileParsed" , this.addRoutes.bind(this));
    this.filePath = controllerPath;
    return new Promise((resolve, reject)=>{
      this.collect().then(()=>{
        resolve(this);
      });
    });
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

