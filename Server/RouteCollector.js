const Collector = require("../NodeAnnotations/Collector");

// Put, post, and delete are all behind https by default.
const secureMethods = ["PUT", "POST", "DELETE"];

module.exports = class RouteCollector {
  constructor(){
    this._ = Symbol("RouteCollector");
    this[this._] = {
      httpRoutes:{},
      httpsRoutes:{},
      collector: new Collector()
    };
  }

  get routes(){
    return {
      httpRoutes: this[this._].httpRoutes,
      httpsRoutes: this[this._].httpsRoutes
    };
  }

  get routePath(){
    return this[this._].collector.filePath;
  }

  get collector(){
    return this[this._].collector;
  }

  addRoutes(controllerData, classRoute){
    for(let method of controllerData.methods){
      let methodData = controllerData.forMethod(method);
      if(!methodData.hasAnnotation("route")){
        continue;
      }
      let routePath = methodData.getAnnotation("route").value;
      if(routePath !== "/"){
        routePath = "/" + routePath;
      }

      let routeName = (classRoute === "/" && routePath ==="/") ?
          classRoute :
          classRoute + routePath;

      let route = {
        controllerMethod: method,
        methodData: methodData,
        get controller(){
          return controllerData;
        }
      };

      let httpMethod = methodData.hasAnnotation("method") ?
          methodData.getAnnotation("method").value.toUpperCase() :
          '';

      // Whether or not the route should be secure, add it to the secure router.
      // This way, static content which doesn't matter will still be delivered whether the user is on
      //  a secure connection or not.

      if((httpMethod !== "" && secureMethods.includes(httpMethod)) ||
          methodData.hasAnnotation("httpsOnly")){
        this[this._].httpsRoutes[routeName] = route;
      } else {
        this[this._].httpRoutes[routeName] = route;
      }
    }
  }

  buildCache(controllerPath, cb){
    this.collector.collectFromPath(controllerPath, ()=>{
      for(let name of this.collector.namespaces){
        let controller = this.collector.classMetadata(name);
        let classRoute = (controller.classDoc.hasAnnotation("classRoute")) ?
            controller.classDoc.getAnnotation("classRoute").value :
            name.replace(controllerPath, "");

        this.addRoutes(controller, classRoute);

      }
      cb(this.routes);
    });
  }
};
