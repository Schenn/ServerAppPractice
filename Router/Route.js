const Autoloader = require("../Server/Autoloader");
const secureMethods = ["PUT", "POST", "DELETE"];

/**
 * Does the route require, and does the request use, a secure connection.
 *
 * @param {Request} req
 * @param {boolean} routeIsSecure
 */
const validateSecureRequest = (req, routeIsSecure)=>{
  if(routeIsSecure && !req.isSecure){
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

  #method = '';
  #controllerData = null;
  #routeData = null;
  #dependsOn = {};
  #dependencies = {};

  /**
   * @param {module.Metadata} controllerData
   * @param {string} method
   * @return {*}
   */
  constructor(controllerData, method){
    if(!method.hasAnnotation("route")){
      throw `No route provided in method data for controller ${controllerData.className} method: ${method}`;
    }
    this.#method = method.name;
    this.#controllerData = controllerData;
  }

  /**
   * Get the base route that the controller for this route uses.
   *
   * @return {string}
   */
  get controllerRoute(){
    return this.#controllerData.classDoc.getAnnotation("classRoute")[0].value;
  }

  /**
   * Get the post-controller part of the url for this route.
   *
   * @return {string}
   */
  get subpath(){
    let routePath = this.#routeData.getFirstAnnotationValue("route");
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
    return this.#controllerData.getInstance();
  }

  /**
   * Get the name of the method on the controller which this route connects to.
   *
   * @return {*|string}
   */
  get method(){
    return this.#method;
  }

  /**
   * Get the metadata for the controller
   *
   * @return {*|Object}
   */
  get controllerData(){
    return this.#controllerData;
  }

  /**
   * Get the whole url past the domain for the given route.
   *
   * @return {string}
   */
  get routePath(){
    let path = (`${this.controllerRoute}${this.subpath}`).replace("//", "/")
      .replace(/^(\/+)|(\/$)/g, '');
    if(path === ""){
      path = "/";
    }
    return path;
  }

  /**
   * Get the http method(s) that this route connects with.
   *
   * @return {string}
   */
  get httpMethod(){
    return this.#routeData.hasAnnotation("httpMethod") ?
      this.#routeData.getFirstAnnotationValue("httpMethod").toUpperCase() : "GET";
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
    return this.#routeData.hasAnnotation("doBefore") ?
      this.#routeData.getFirstAnnotationValue("doBefore") : "";
  }

  /**
   * Does the route require a secure connection
   *
   * @return {boolean}
   */
  isSecure(){
    return ((this.#routeData.hasAnnotation("https")) || (secureMethods.includes(this.httpMethod)));
  }

  addDependency(name, thing){
    this.#dependsOn[name] = thing;
  }

  /**
   * Instantiates dependencies
   *  Available to do other route argument preperations before the handler chain begins.
   */
  prepareDependencies(req){
    for(let [name, target] of Object.entries(this.#dependsOn)){
      if(req.httpMethod === "GET"){
        this.#dependencies[name] = (req.query === "") ?
          new target() :
          new target(req.query);
      } else {
        this.#dependencies[name] = (typeof req.payload[name] !== "undefined") ?
          new target(req.payload[name]) :
          new target(req.payload);
      }
    }
  }

  get dependencies(){
    return this.#dependencies;
  }

  getDependency(name){
    return this.#dependencies[name];
  }

  cacheDependencies(){
    let dependencies = (this.#routeData.hasAnnotation("depends")) ?
      this.#routeData.getAnnotation("depends") : [];
    dependencies.forEach((dependencyTag)=>{
      let className = dependencyTag.type;
      let name = dependencyTag.value;
      let targetClass = Autoloader(className);
      this.addDependency(name, targetClass);
    });
  }


  /**
   * Validate that the request meets the requirements of the route
   *  Adds any needed dependencies to the request object.
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

      // If the response wasn't closed by an invalid form
    if(res.isOpen() && doBefore !== '') {
      // @doBefore path/to/class::method  (e.g. game/scoreboard::addHighScore)
      if (doBefore.indexOf("\\") === -1) {
        // If the doBefore does not reference a namespace, treat as same controller instance.
        controller[doBefore](req, res, this.dependencies);
      } else {
        let namespacedDoBefore = doBefore.split("::");
        let targetClass = Autoloader(namespacedDoBefore[0]);
        let target = new targetClass();
        target[namespacedDoBefore[1]](req, res, this.dependencies);
      }
    }

    // If the response wasn't closed by an error, trigger the controller callback.
    if(res.isOpen()){
      // call the route handler
      controller[this.method](req, res, this.dependencies);
      // convert the response to json if its tagged to be json
      if (this.#routeData.hasAnnotation("json")) {
        res.toJson();
      }
    }

    // If the request wasn't closed by an error, it processed succesfully.  close the response to the client.
    if(res.isOpen()){
      res.close();
    }
  }
};