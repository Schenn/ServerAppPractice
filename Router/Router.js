const cleanRegex = /^(\/+)|(\/$)/g;
const Collector = require("@schennco/nodeannotations/Collector");
const Route = require("./Route");

/**
 * Handle redirecting routes to class methods.
 *
 * @type {module.Router}
 */
module.exports = class Router extends Collector {
  #routes = {};
  #before = [];
  #onRoute = {};

  /**
   * Add a route to the router.
   *
   *  The route is memoized as httpMethod::path.
   *    That way multiple methods can each handle a different http method for a given path.
   *    (e.g. GET /create -- controller::renderForm. POST /create -- controller::saveForm.)
   *
   * @param {module.Route} route
   */
  addRoute(route){
    let cleanPath = route.routePath.replace(cleanRegex, '');
    if(cleanPath === ''){
      cleanPath = "/";
    }
    let routePath = `${route.httpMethod}::${cleanPath}`;
    route.cacheDependencies();
    this.#routes[routePath] = route;
    this.#onRoute[routePath] = [];
  }

  /**
   * Collect the methods from a controller and memoize any routes found.
   *
   * @param {Object | module.Metadata} controllerData
   */
  addRoutes(controllerData, namespace){
    if(!controllerData.classDoc.hasAnnotation("classRoute")){
      controllerData.classDoc.annotationFromPhrase(`* @classRoute ${namespace.toLowerCase()}`);
    }

    for(let doc of controllerData){
      if(doc.type === "method" && doc.doc.hasAnnotation("route")){
        this.addRoute(new Route(controllerData, doc.doc));
      }
    }
  }


  /**
   * Get the data object for a given route.
   *
   * @param {module.Request} req The request object.
   * @return {Object}
   */
  routeMeta(req){
    let cleanPath = req.path.replace(cleanRegex, '');
    if(cleanPath === ''){
      cleanPath = "/";
    }
    let path = `${req.httpMethod}::${cleanPath}`;
    return this.#routes[path] ?
      this.#routes[path] :
      null;
  }

  /**
   * Collect the route handlers found on a given path and identify the routes that belong to it.
   *
   * @param {string} controllerPath The parent directory for your controllers
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
   * Middleware to trigger before routing begins.
   *  This middleware is triggered regardless of the requested route.
   *
   * @param req
   * @param res
   * @param route
   */
  runBefore(req, res, route){
    for(let cb of this.#before){
      cb(req, res, route);
    }
  }

  /**
   * Triggers the memoized methods from onRoute before the route method is called.
   *  This middleware is triggered on specific routes which were memoized via this.onRoute.
   *
   * @see Router.onRoute
   * @param req
   * @param res
   * @param route
   */
  runOnRoute(req, res, route){
    for(let cb of this.#onRoute[route.httpMethod + '::' + route.routePath]){
      cb(req, res, route);
    }
  }

  /**
   * Get the controller for the given path and trigger the matching route handler.
   *
   * @param {module.Request} req
   * @param {module.Response} res
   */
  handle(req, res) {
    let route = this.routeMeta(req);
    if (route == null) {
      res.statusCode = 404;
    } else {
      route.validateRequest(req);
      route.prepareDependencies(req);
      this.runBefore(req, res, route);
      this.runOnRoute(req, res, route);
      route.handle(req, res);
    }
    res.close();
  }

  /**
   * Add a callback to run before any routes have been triggered.
   *  FIFO
   *
   * @param cb
   */
  beforeRouting(cb){
    this.#before += cb;
  }

  /**
   * Add a callback to run before sending the request to the controller for the given route.
   *  This lets you inject data into the request and response before it gets to the controller.
   *
   * @param route
   * @param cb
   */
  onRoute(route, cb){
    if(typeof this.#onRoute[route] === "undefined"){
      this.#onRoute[route] = [];
    }
    this.#onRoute[route] += cb;
  }
};

