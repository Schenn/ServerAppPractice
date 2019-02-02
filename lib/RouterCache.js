const fs = require("fs");
const path = require("path");

const Collector = require("../annotations/Collector");

// Put, post, and delete are all behind https by default.
const secureMethods = ["PUT", "POST", "DELETE"];

// For reference
const classRouteAnnotation = '@classroute';
const routeAnnotation = '@route';
const httpMethodAnnotation = "@method";
const jsonAnnotation = "@json";
const secureOnlyAnnotation = "@httpsOnly";
const commentOpen = '/**';
const commentClose = '*/';

const annotationValue = function(data, start) {
  return data.replace("=", " ").substring(start, data.indexOf("\n", start)-2).trim();
};

let httpRoutes = {};
let httpsRoutes = {};
let controllerPath = "";
let collector = new Collector();

module.exports = class RouterCache {
  constructor(cachePath){
    this.basePath = cachePath;
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

  buildCacheAsync(controllerPath, cb){
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

  buildCacheSync(controllerPath, cb){
    this.controllerPath = controllerPath;
    fs.readdirSync(controllerPath).forEach((file) => {
      this.readControllerSync(file);
    });
    cb(this.routes);
  }

  readControllerSync(controllerFileName){
    let controllerPath = path.join(this.controllerPath, controllerFileName);
    this.extractRouteFromController(fs.readFileSync(controllerPath, 'utf8'), controllerFileName.replace(".js", ""));
  }

  extractRouteFromController(controllerText, controllerFileName){
    let classRouteIndex = controllerText.indexOf(classRouteAnnotation);
    let classRoute = classRouteIndex > -1 ?
        annotationValue(controllerText, classRouteIndex + classRouteAnnotation.length) :
        controllerFileName.toLowerCase();

    let index = 0;
    while(index > -1){
      let commentIndexStart = controllerText.indexOf(commentOpen, index);
      let comment = "";
      // If there's no docblock, stop.
      if(commentIndexStart === -1) {
        index = commentIndexStart;
        break;
      }

      let commentEnd = controllerText.indexOf(commentClose, commentIndexStart) + commentClose.length;
      comment = controllerText.substring(commentIndexStart, commentEnd).trim();

      // Find the next 'route' annotation.
      let routeIndex = comment.indexOf(routeAnnotation);
      // If there's no route annotation in this comment, move to the next.
      if(routeIndex === -1) {
        index = commentEnd;
      } else {
        let routePath = annotationValue(comment, routeIndex + routeAnnotation.length).trim();
        if(routePath[0] !== "/"){
          routePath = "/" + routePath;
        }
        let routeName = (classRoute === "/" && routePath ==="/") ?
            classRoute :
            classRoute + routePath;

        let httpMethodI = comment.indexOf(httpMethodAnnotation);
        let httpMethod = (httpMethodI > -1) ?
            annotationValue(comment, httpMethodI + httpMethodAnnotation.length).trim().toUpperCase() :
            "";

        let jsonContent = comment.indexOf(jsonAnnotation) > -1;

        let secure = (httpMethod !== "" && secureMethods.includes(httpMethod)) ||
            comment.indexOf(secureOnlyAnnotation) > -1;

        let methodEndIndex = controllerText.indexOf("(", commentEnd);
        let controllerMethod = controllerText.substring(commentEnd, methodEndIndex).trim();


        // Whether or not the route should be secure, add it to the secure router.
        // This way, users who are on a secure connection, who then navigate to an insecure route,
        //  are actually redirected to the secure connection.
        let route = {
          controllerMethod: controllerMethod,
          method: httpMethod
        };
        if(jsonContent){
          route.type = "json";
        }

        // Whether or not the route should be secure, add it to the secure router.
        // This way, users who are on a secure connection, who then navigate to an insecure route,
        //  are actually redirected to the secure connection.

        httpsRoutes[routeName] = route;

        if(!secure){
          httpRoutes[routeName] = route;
        }

        index = controllerText.indexOf("/**", methodEndIndex)-1;
      }
    }
  }
};
