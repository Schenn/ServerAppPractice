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
      if(https){
        this[this._].httpsRoutes[route.replace(cleanRegex , '')] = routes[route];
      } else {
        this[this._].httpRoutes[route.replace(cleanRegex , '')] = routes[route];
      }
    }
  }

  routeMeta(route, https=false){
    let routeHandle = null;
    // if the request came from the https connection, check for the https route before checking the httproutes.
    //  http routes can be loaded over https
    if(https && typeof this.httpsRoutes[route] !== "undefined"){
      routeHandle = this.httpsRoutes[route];
    } else if(typeof this.httpRoutes[route] !== "undefined"){
      routeHandle = this.httpRoutes[route];
    }

    return routeHandle;
  }

  validateRequest(route, method, https){
    let routeMeta = this.routeMeta(route, https);

    let error = '';
    let fail = false;
    // Validate request's http method against the path's metadata.
    // if the routeHandle is still null, that's ok, we'll use the notFound method instead.
    if(routeMeta) {
      if(routeMeta.method instanceof Array && !routeMeta.method.includes(method)) {
        error += routeMeta.method.join(" ");
        fail = true;
      } else if (routeMeta.method instanceof String && routeMeta.method !== method){
        error += routeMeta.method;
        fail = true;
      }
      if(fail){
        error = `Heard invalid method for route: ${route} Method Provided: ${method} Methods accepted: `;
      }
    }
    return {isValid: !fail, message: error};
  }

  handle(data, writeResponse, https=false) {
    let routeMeta = this.routeMeta(data.path, https);
    if (routeMeta != null) {
      let controllerClass = require(controllerPath + routeMeta.controller);
      let controller = new controllerClass();
      controller[routeMeta.controllerMethod](data, (status = 200, payload) => {
        let headers = [];
        if (routeMeta.type === 'json') {
          payload = JSON.stringify(payload);
          headers.push({key: 'content-type', value: 'application/json'});
        }

        writeResponse(status, payload, headers);
      });
    } else {
      writeResponse(404);
    }
  }
};

