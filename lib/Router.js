const controllerPath = "../controllers/";
const cleanRegex = /^\/+|\/+$/g;

module.exports = class Router {
  constructor(){
    this._ = Symbol("router");
    this[this._] = {
      httpsRoutes:{},
      httpRoutes:{}
    };
  }

  get httpRoutes(){
    return this[this._].httpRoutes
  }

  get httpsRoutes(){
    return this[this._].httpsRoutes;
  }

  addRoutes(routes, https=false){
    for(let route in routes){
      let instructions = routes[route];
      let controllerClass = require(controllerPath + routes[route].controller);
      let controller = new controllerClass();
      instructions.handle = controller[instructions.controllerMethod];
      if(https){
        this[this._].httpsRoutes[route.replace(cleanRegex , '')] = instructions;
      } else {
        this[this._].httpRoutes[route.replace(cleanRegex , '')] = instructions;
      }
    }
  }
};

