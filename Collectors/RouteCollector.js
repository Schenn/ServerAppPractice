const Collector = require("../NodeAnnotations/Collector");
const Route = require("../Server/Route");
const Router = require("../Server/Router");

// Put, post, and delete are all behind https by default.
const secureMethods = ["PUT", "POST", "DELETE"];
const _ = Symbol("private");

module.exports = class RouteCollector extends Collector {

  constructor(){
    super();
    this[_].router = new Router();
  }

  /**
   * Add a route to the router.
   * @param {Route} route
   */
  addRoute(route){
    this[_].router.addRoute(route);
  }

  /**
   * Collect the methods from a controller and memoize any routes found.
   *
   * @param {Object} controllerData
   */
  addRoutes(controllerData){
    if(!controllerData.classDoc.hasAnnotation("classRoute")){
      controllerData.classDoc.addAnnotation(`@classRoute ${namespace.toLowerCase()}`);
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
   * Collect the controllers found on a given path and identify the routes that belong to it.
   *
   * @param {String} controllerPath The parent directory for your controllers
   * @param {function} cb The callback to trigger when all the controllers have been processed.
   */
  buildCache(controllerPath, cb){
    this.onFileParsed = (controllerData, namespace) => {
      if(!controllerData.classDoc.hasAnnotation("classRoute")){
        controllerData.classDoc.addAnnotation(`@classRoute ${namespace.toLowerCase()}`);
      }
      this.addRoutes(controllerData);
    };
    this.onComplete = ()=>{
      cb(this[_].router);
    };
    this.collectFromPath(controllerPath);
  }
};
