const fs = require("fs");
const path = require("path");
const Writer = require("./Writer.js");

const secureMethods = ["PUT", "POST", "DELETE"];

let httpRoutes = {};
let httpsRoutes = {};

module.exports = class RouterCache {
  constructor(cachePath){
    this.writer = new Writer();
    this.writer.basePath = cachePath;
    this.writer.dir = '/routes/';
  }

  static get FILENAME(){
    return "routecache.json";
  }

  readController(filepath, controller){
    let controllerPath = path.join(filepath, controller);
    fs.readFile(controllerPath, 'utf8', (err, data)=>{
      if(err){
        console.log(err);
      } else {
        this.extractRouteFromController(data, controller.replace(".js", ""));
      }
    });
  }

  buildCacheAsync(controllerPath){
    if(!this.writer.fileExistsSync(this.constructor.FILENAME)) {
      controllerPath = path.join(process.cwd(), controllerPath);
      fs.readdir(controllerPath, (err, files) => {
        files.forEach((file)=>{
          this.readController(controllerPath, file);
        });
        this.writeCache();
      });

    } else {
      console.log("Route Cache already exists. Run ClearCache to remove.");
    }
  }

  clearCache(){
    this.writer.delete(this.constructor.FILENAME);
  }

  loadCache(cb){
    this.writer.readSync(this.constructor.FILENAME, true, cb);
  }

  writeCache(){

    this.writer.append(this.constructor.FILENAME, {
      httpRoutes: httpRoutes,
      httpsRoutes: httpsRoutes
    }, (err)=>{
      if(err){
        console.log(err);
      }
    });
  }

  extractRouteFromController(data, controller){
    let classRouteIndex = data.indexOf("@classRoute=");
    let classRoute = classRouteIndex > -1 ?
        data.substring(classRouteIndex+13, data.indexOf("\n", classRouteIndex)-2) :
        controller.toLowerCase();


    let index = 0;
    while(index > -1){
      let commentIndexStart = data.indexOf("/**", index);
      let comment = "";
      if(commentIndexStart > -1){
        commentIndexStart += 3;
        let commentEnd = data.indexOf("*/", commentIndexStart) + 2;
        comment = data.substring(commentIndexStart, commentEnd);

        // Find the next 'route' annotation.
        let routeIndex = comment.indexOf("@route=");
        let routeName = "";
        if(routeIndex > -1){
          let routePath = comment.substring(routeIndex + 8, comment.indexOf("\n", routeIndex + 8)-2);
          if(routePath[0] !== "/"){
            routePath = "/" + routePath;
          }
          if(classRoute === "/" && routePath ==="/"){
            routeName = classRoute;
          } else {
            routeName = classRoute + routePath;
          }

          let httpMethodI = comment.indexOf("@method=");
          let httpMethod = "";
          if(httpMethodI > -1){
            httpMethod = comment.substring(httpMethodI + 9, comment.indexOf("\n", httpMethodI + 9) - 2);
          }

          let jsonContent = comment.indexOf("@json") > -1;

          let secure = (httpMethod !== "" && secureMethods.includes(httpMethod)) ||
              comment.indexOf("@httpsOnly") > -1;

          let methodEndIndex = data.indexOf("(", commentEnd);
          let controllerMethod = data.substring(commentEnd, methodEndIndex).trim();


          // Whether or not the route should be secure, add it to the secure router.
          // This way, users who are on a secure connection, who then navigate to an insecure route,
          //  are actually redirected to the secure connection.
          let route = {
            controller: controller,
            controllerMethod: controllerMethod,
            method: httpMethod
          };
          if(jsonContent){
            route.type = "json";
          }
          httpsRoutes[routeName] =route;

          if(!secure){
            httpRoutes[routeName] = route;
          }

          index = data.indexOf("/**", methodEndIndex);
          if(index > 0){
            index += 3;
          }
        } else {
          index = data.indexOf("*/", commentIndexStart) + 2;
        }
      } else {
        index = commentIndexStart;
      }
    }


  }

};
