const Collector = require("../annotations/Collector");

// Put, post, and delete are all behind https by default.
const secureMethods = ["PUT", "POST", "DELETE"];

let httpRoutes = {};
let httpsRoutes = {};
let controllerPath = "";
let collector = new Collector();

module.exports = class RouteCollector {
  constructor(){
  }

  get routes(){
    return {
      httpRoutes: httpRoutes,
      httpsRoutes: httpsRoutes
    };
  }

  get controllerPath(){
    return controllerPath;
  }

  set controllerPath(path){
    controllerPath = path;
  }

  buildCache(controllerPath, cb){
    this.controllerPath = controllerPath;
    collector.collectFromPath(this.controllerPath, ()=>{
      for(let name of collector.namespaces){
        let data = collector.classMetadata(name);
        let classRoute = (data.classDoc.hasAnnotation("classRoute")) ?
            data.classDoc.getAnnotation("classRoute").value :
            data.fileName.replace(".js", "");

        for(let method of data.methods){
          let methodData = data.forMethod(method);
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

          let httpMethod = methodData.hasAnnotation("method") ?
              methodData.getAnnotation("method").value.toUpperCase() :
              '';

          let secure = (httpMethod !== "" && secureMethods.includes(httpMethod)) ||
              methodData.hasAnnotation("httpsOnly");

          let route = {
            controllerMethod: method,
            method: httpMethod
          };

          if(methodData.hasAnnotation("json")){
            route.type = "json";
          }

          // Whether or not the route should be secure, add it to the secure router.
          // This way, users who are on a secure connection, who then navigate to an insecure route,
          //  are actually redirected to the secure connection.

          httpsRoutes[routeName] = route;

          if(!secure){
            httpRoutes[routeName] = route;
          }
        }

      }
      cb(this.routes);
    });
  }
};
