const Collector = require("../NodeAnnotations/Collector");

// Put, post, and delete are all behind https by default.
const secureMethods = ["PUT", "POST", "DELETE"];

module.exports = class RouteCollector extends Collector {

  constructor(){
    super();
    this[this._].httpRoutes = {};
    this[this._].httpsRoutes = {};
  }

  get routes(){
    return {
      httpRoutes: this[this._].httpRoutes,
      httpsRoutes: this[this._].httpsRoutes
    };
  }

  addRoutes(controllerData, classRoute){
    for(let method of controllerData.methods){
      let methodData = controllerData.forMethod(method);
      if(!methodData.hasAnnotation("route")){
        continue;
      }
      let routePath = methodData.getAnnotation("route").value;
      if(routePath === ''){
        routePath = method.toLowerCase();
      }
      if(routePath[0] !== "/"){
        routePath = "/" + routePath;
      }

      let routeName = '';
      if(classRoute !== "/"){
        routeName += classRoute;
      }
      routeName += routePath;

      let route = {
        controllerMethod: method,
        methodData: methodData,
        get controllerData(){
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
    this.onFileParsed = (controller, namespace)=>{
      let classRoute = (controller.classDoc.hasAnnotation("classRoute")) ?
        controller.classDoc.getAnnotation("classRoute").value :
        namespace.toLowerCase();

      this.addRoutes(controller, classRoute);
    };
    this.onComplete = ()=>{
      cb(this.routes);
    };
    this.collectFromPath(controllerPath);
  }
};
