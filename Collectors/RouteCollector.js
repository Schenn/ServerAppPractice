const Collector = require("../NodeAnnotations/Collector");
const Route = require("../Server/Route");
const Router = require("../Server/Router");

// Put, post, and delete are all behind https by default.
const secureMethods = ["PUT", "POST", "DELETE"];
const _ = Symbol("private");

module.exports = class RouteCollector extends Collector {

  constructor(){
    super();
    this[_] = {
      router: new Router()
    };
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
   * @param {Object | Metadata} controllerData
   */
  addRoutes(controllerData, namespace){
    if(!controllerData.classDoc.hasAnnotation("classRoute")){
      controllerData.classDoc.addAnnotation(`* @classRoute ${namespace.toLowerCase()}`);
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
   */
  buildCache(controllerPath){
    this.on("fileParsed" , this.addRoutes.bind(this));
    this.filePath = controllerPath;
    return new Promise((resolve, reject)=>{
      this.collect().then(()=>{
        resolve(this[_].router);
      });
    });
  }
};
