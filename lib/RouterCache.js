const fs = require("fs");
const path = require("path");
const Writer = require("./Writer.js");

// Put, post, and delete are all behind https by default.
const secureMethods = ["PUT", "POST", "DELETE"];
const cacheOut = '/routes/';
const filename = 'routecache.json';

// For reference
// @todo Should this be regex instead, so that we can handle optional spaces around the = 
const classRouteAnnotation = '@classroute=';
const routeAnnotation = '@route=';
const httpMethodAnnotation = "@method=";
const jsonAnnotation = "@json";
const secureOnlyAnnotation = "@httpsOnly";
const commentOpen = '/**';
const commentClose = '*/';

const substringToNewline = function(data, start) {
  return data.substring(start, data.indexOf("\n", start)-2).trim();
};

let httpRoutes = {};
let httpsRoutes = {};

module.exports = class RouterCache {
  constructor(cachePath){
    this.writer = new Writer();
    this.writer.basePath = cachePath;
    this.writer.dir = cacheOut;
  }

  static get FILENAME(){
    return filename;
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
    let classRouteIndex = data.indexOf(classRouteAnnotation);
    let classRoute = classRouteIndex > -1 ?
        substringToNewline(data, classRouteIndex+13) :
        controller.toLowerCase();

    let index = 0;
    while(index > -1){
      let commentIndexStart = data.indexOf(commentOpen, index);
      let comment = "";
      // If there's no docblock, stop.
      if(commentIndexStart === -1) {
        index = commentIndexStart;
      } else {
        let commentEnd = data.indexOf(commentClose, commentIndexStart) + 2;
        comment = data.substring(commentIndexStart, commentEnd).trim();

        // Find the next 'route' annotation.
        let routeIndex = comment.indexOf(routeAnnotation);
        // If there's no route annotation in this comment, move to the next.
        if(routeIndex === -1) {
          index = commentEnd;
        } else {
          let routePath = substringToNewline(comment, routeIndex+8);
          if(routePath[0] !== "/"){
            routePath = "/" + routePath;
          }
          let routeName = (classRoute === "/" && routePath ==="/") ?
              classRoute :
              classRoute + routePath;

          let httpMethodI = comment.indexOf(httpMethodAnnotation);
          let httpMethod = (httpMethodI > -1) ?
              substringToNewline(comment, httpMethodI + 9).toUpperCase() :
              "";

          let jsonContent = comment.indexOf(jsonAnnotation) > -1;

          let secure = (httpMethod !== "" && secureMethods.includes(httpMethod)) ||
              comment.indexOf(secureOnlyAnnotation) > -1;

          let methodEndIndex = data.indexOf("(", commentEnd);
          let controllerMethod = data.substring(commentEnd, methodEndIndex).trim();


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

          httpsRoutes[routeName] =route;

          if(!secure){
            httpRoutes[routeName] = route;
          }

          index = data.indexOf("/**", methodEndIndex)-1;
        }
      }
    }
  }
};
