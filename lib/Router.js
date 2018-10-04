const fs = require("fs");
const RouterCache = require("./RouterCache");

let rc = new RouterCache(".cache");

const httpRouter = {};
const httpsRouter = {};


rc.loadCache((data)=>{
  let routes = data.httpRoutes;
  let secureRoutes = data.httpsRoutes;
  for(let route in routes){
    let instructions = routes[route];
    let controllerClass = require("../controllers/" + routes[route].controller);
    let controller = new controllerClass();
    instructions.handle = controller[instructions.controllerMethod];
    httpRouter[route.replace(/^\/+|\/+$/g , '')] = instructions
  }

  for(let secRoute in secureRoutes){
    let instructions = secureRoutes[secRoute];
    let controllerClass  = require("../controllers/" + secureRoutes[secRoute].controller);
    let controller = new controllerClass();
    instructions.handle = controller[instructions.controllerMethod];
    httpsRouter[secRoute.replace(/^\/+|\/+$/g , '')] = instructions
  }
});


module.exports = {
  httpRouter:httpRouter,
  httpsRouter:httpsRouter
};

