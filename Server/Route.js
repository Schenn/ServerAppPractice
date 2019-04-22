const _ = Symbol("private");
const secureMethods = ["PUT", "POST", "DELETE"];

/**
 * Does the route require, and does the request use, a secure connection.
 *
 * @param {Request} req
 * @param {boolean} routeIsSecure
 */
const validateSecureRequest = (req, routeIsSecure)=>{
  if(routeIsSecure && !req.isSecure()){
    throw `Route requires a secure connection. Connection is insecure.`;
  }
};

/**
 * Does the request's http method match the route's required http method.
 *
 * @param {Request} req
 * @param {string|array} httpMethod
 */
const validateHttpMethod = (req, httpMethod)=>{
  if((httpMethod instanceof Array && !httpMethod.includes(req.httpMethod)) ||
    (httpMethod instanceof String && httpMethod !== req.httpMethod)){
    throw `Heard invalid method for route: ${req.path} Method Provided: 
        ${req.httpMethod} Methods accepted: ${httpMethod}`;
  }
};

module.exports = class Route {

  /**
   * @param {Object} controllerData
   * @param {string} method
   * @return {*}
   */
  constructor(controllerData, method){
    this[_] = {
      get method(){ return method;},
      get controllerData(){ return controllerData;},
      get routeData(){ return controllerData.forMethod(method);}
    };
  }

  /**
   * Get the base route that the controller for this route uses.
   *
   * @return {string}
   */
  get controllerRoute(){
    return this[_].controllerData.getAnnotation("classRoute").value;
  }

  /**
   * Get the post-controller part of the url for this route.
   *
   * @return {string}
   */
  get subpath(){
    let routePath = this[_].routeData.getAnnotation("route").value;
    if(routePath[0] !== "/"){
      routePath = "/" + routePath;
    }
    return routePath;
  }

  /**
   * Get an instance of the controller for this route.
   *
   * @return {*}
   */
  get controller(){
    return this[_].controllerData.getInstance();
  }

  /**
   * Get the name of the method on the controller which this route connects to.
   *
   * @return {*|string}
   */
  get method(){
    return this[_].method;
  }

  /**
   * Get the metadata for the controller
   *
   * @return {*|Object}
   */
  get controllerData(){
    return this[_].controllerData;
  }

  /**
   * Get the whole url past the domain for the given route.
   *
   * @return {string}
   */
  get routePath(){
    let controllerRoute = this.controllerRoute;
    let subpath = this.subpath;
    return (controllerRoute + subpath).replace("//", "/");
  }

  /**
   * Get the http method(s) that this route connects with.
   *
   * @return {string}
   */
  get httpMethod(){
    return this[_].routeData.hasAnnotation("method") ?
      this[_].routeData.getAnnotation("method").value.toUpperCase() : "GET";
  }

  /**
   * Get the doBefore annotation from the route.
   *
   *  Use doBefore to pass the request / response into another (class and ) method.
   *    for example: process the incoming data for a post against a validator.
   *    
   * @return {string}
   */
  get doBefore(){
    return this[_].routeData.hasAnnotation("doBefore") ?
      this[_].routeData.getAnnotation("doBefore").value : "";
  }

  /**
   * Does the route require a secure connection
   *
   * @return {boolean}
   */
  isSecure(){
    return ((this[_].routeData.hasAnnotation("https")) || (secureMethods.includes(this.httpMethod)));
  }

  /**
   * Validate that the request meets the requirements of the route
   *
   * @param {Request} req
   */
  validateRequest(req){
    let httpMethod = this.httpMethod;
    validateSecureRequest(req, this.isSecure());
    if(httpMethod !== "GET"){
      validateHttpMethod(req, httpMethod);
    }
  }

  /**
   * The route has been triggered, call the appropriate controller method.
   *
   * @param {Request} req
   * @param {Response} res
   */
  handle(req, res){
    let controller = this.controller;

    controller[route.controllerMethod](req, res);
    if (this[_].routeData.hasAnnotation("json")) {
      res.content = JSON.stringify(res.content);
      res.addHeader('content-type', 'application/json');
    }
  }
};