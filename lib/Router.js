const RouterCache = require("./RouterCache");

const rc = new RouterCache(".cache");
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

rc.loadCache((data)=>{
  loadRoutesFromCache(data.httpRoutes, httpRouter);
  loadRoutesFromCache(data.httpsRoutes, httpsRouter);
});

module.exports = {
  httpRouter:httpRouter,
  httpsRouter:httpsRouter
};

