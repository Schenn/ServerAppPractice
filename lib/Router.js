const RouterCache = require("./RouterCache");

const rc = new RouterCache();
const httpRouter = {};
const httpsRouter = {};
const controllerPath = "../controllers/";
const cleanRegex = /^\/+|\/+$/g;

const loadRoutesFromCache = function(routes, routeMap){
  for(let route in routes){
    let instructions = routes[route];
    let controllerClass = require(controllerPath + routes[route].controller);
    let controller = new controllerClass();
    instructions.handle = controller[instructions.controllerMethod];
    routeMap[route.replace(cleanRegex , '')] = instructions;
  }
};

rc.buildCacheSync(path.join(process.cwd(),"controllers"), (routes)=>{
  loadRoutesFromCache(routes.httpRoutes, httpRouter);
  loadRoutesFromCache(routes.httpsRoutes, httpsRouter);
}, false);


module.exports = {
  httpRouter:httpRouter,
  httpsRouter:httpsRouter
};

