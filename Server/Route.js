const _ = Symbol("private");
const secureMethods = ["PUT", "POST", "DELETE"];

const validateSecureRequest = (req, routeIsSecure)=>{
  if(routeIsSecure && !req.isSecure()){
    throw `Route requires a secure connection. Connection is insecure.`;
  }
};

const validateHttpMethod = (req, httpMethod)=>{
  if((httpMethod instanceof Array && !httpMethod.includes(req.httpMethod)) ||
    (httpMethod instanceof String && httpMethod !== req.httpMethod)){
    throw `Heard invalid method for route: ${req.path} Method Provided: 
        ${req.httpMethod} Methods accepted: ${httpMethod}`;
  }
};

module.exports = class Route {

  constructor(controllerData, method){
    let routeData = controllerData.forMethod(method);
    this[_] = {
      get method(){ return method;},
      get controllerData(){ return controllerData;},
      get routeData(){ return routeData;}
    };
  }

  get controllerRoute(){
    return this[_].controllerData.getAnnotation("classRoute").value;
  }

  get subpath(){
    let routePath = this[_].routeData.getAnnotation("route").value;
    if(routePath[0] !== "/"){
      routePath = "/" + routePath;
    }
    return routePath;
  }

  get controller(){
    return this[_].controllerData.getInstance();
  }

  get method(){
    return this[_].method;
  }

  get controllerData(){
    return this[_].controllerData;
  }

  get routePath(){
    let controllerRoute = this.controllerRoute;
    let subpath = this.subpath;
    return (controllerRoute + subpath).replace("//", "/");
  }

  get httpMethod(){
    return this[_].routeData.hasAnnotation("method") ?
      this[_].routeData.getAnnotation("method").value.toUpperCase() : "GET";
  }

  isSecure(){
    return ((this[_].routeData.hasAnnotation("https")) || (secureMethods.includes(this.httpMethod)));
  }

  validateRequest(req){
    let httpMethod = this.httpMethod;
    validateSecureRequest(req, this.isSecure());
    if(httpMethod !== "GET"){
      validateHttpMethod(req, httpMethod);
    }
  }

  handle(req, res){
    let controller = this.controller;
    controller[route.controllerMethod](req, res);
    if (this[_].routeData.hasAnnotation("json")) {
      res.content = JSON.stringify(res.content);
      res.addHeader('content-type', 'application/json');
    }
  }
};