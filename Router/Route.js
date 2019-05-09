const Autoloader = require("../Server/Autoloader");
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
    throw new Error(`Route requires a secure connection. Connection is insecure.`);
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
    throw new Error(`Heard invalid method for route: ${req.path} Method Provided: 
        ${req.httpMethod} Methods accepted: ${httpMethod}`);
  }
};

module.exports = class Route {

  /**
   * @param {Metadata} controllerData
   * @param {string} method
   * @return {*}
   */
  constructor(controllerData, method){
    let meta = controllerData.forMethod(method);
    if(!meta.hasAnnotation("route")){
      throw `No route provided in method data for controller ${controllerData.className} method: ${method}`;
    }
    this[_] = {
      method: method,
      controllerData: controllerData,
      routeData: controllerData.forMethod(method)
    };
  }

  /**
   * Get the base route that the controller for this route uses.
   *
   * @return {string}
   */
  get controllerRoute(){
    return this[_].controllerData.classDoc.getAnnotation("classRoute")[0].value;
  }

  /**
   * Get the post-controller part of the url for this route.
   *
   * @return {string}
   */
  get subpath(){
    let routePath = this[_].routeData.getAnnotation("route")[0].value;
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
    return (`${this.controllerRoute}${this.subpath}`).replace("//", "/");
  }

  /**
   * Get the http method(s) that this route connects with.
   *
   * @return {string}
   */
  get httpMethod(){
    return this[_].routeData.hasAnnotation("httpMethod") ?
      this[_].routeData.getAnnotation("httpMethod")[0].value.toUpperCase() : "GET";
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
      this[_].routeData.getAnnotation("doBefore")[0].value : "";
  }

  get form(){
    return this[_].routeData.hasAnnotation("form") ? this[_].routeData.getAnnotation("form")[0] : "";
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
    try {
      let httpMethod = this.httpMethod;
      validateSecureRequest(req, this.isSecure());
      if(httpMethod !== "GET"){
        validateHttpMethod(req, httpMethod);
      }
    } catch (e){
      throw e;
    }
  }

  /**
   * The route has been triggered, call the appropriate handler methods.
   *
   * @param {module.Request} req
   * @param {module.Response} res
   */
  handle(req, res){
    let controller = this.controller;
    let doBefore = this.doBefore;
    let hasDoBefore = doBefore !== '';

    if(this.form){
      req.useForm(this.form);
    }
      // If the response wasn't closed by an invalid form
    if(res.isOpen() && hasDoBefore) {
      // @doBefore path/to/class::method  (e.g. game/scoreboard::addHighScore)
      if (doBefore.indexOf("\\") === -1) {
        // If the doBefore does not reference a namespace, treat as same controller instance.
        controller[doBefore](req, res);
      } else {
        let namespacedDoBefore = doBefore.split("::");
        let targetClass = Autoloader(namespacedDoBefore[0]);
        let target = new targetClass();
        target[namespacedDoBefore[1]](req, res);
      }
    }

    // If the response wasn't closed by an error in the same class method referenced in the dobefore,
    //  or if there is no doBefore method specified.
    if(res.isOpen()){
      controller[this.method](req, res);
      if (this[_].routeData.hasAnnotation("json")) {
        res.toJson();
      }
    }

    if(res.isOpen()){
      res.close();
    }
  }
};