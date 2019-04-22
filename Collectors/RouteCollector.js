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

  get routes(){
    return this[_].routes;
  }

  addRoute(route){
    this[_].router.addRoute(route);
  }

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
