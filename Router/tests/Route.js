const assert = require("assert");
const path = require("path");
const Route = require("../Route");
const Metadata = require("../../NodeAnnotations/Metadata");

let mockIndexController = path.join(process.cwd(), "mocks/MockIndexController.js");
let mockOtherController = path.join(process.cwd(), "mocks/MockOtherController.js");

let indexMeta = new Metadata();
let otherMeta = new Metadata();

/**
 * Test that the route paths output as expected
 *  controllerRoute: controller.classRoute
 *  subpath: /method.route
 *  routePath: controller.classRoute/method.route
 *
 * @param route
 * @param method
 * @param controllerRoute
 */
const testRoutePaths = (route, method, controllerRoute)=>{
  // for the test classes, the route looks like : route: "method", controller method: "testMethod".
  let methodToRoute = method.replace("test","").toLowerCase();

  assert.ok(route);
  assert.equal(controllerRoute, route.controllerRoute);
  // For the tests, all "index" methods route to path "/" for their controller.
  if(methodToRoute === "App.index.index"){
    assert.equal("/", route.subpath);
    let path = (controllerRoute !== "/") ?
      `${controllerRoute}/` :
      "/";
    assert.equal(path, route.routePath);
  } else {
    assert.equal(`/${methodToRoute}`, route.subpath);
    let testPath = controllerRoute;
    // don't double the slash in our expected assertion value.
    testPath += (controllerRoute === '/') ? methodToRoute : `/${methodToRoute}`;
    assert.equal(testPath, route.routePath);
  }
};

/**
 * Test that the route does not throw if the request parameters match the method requirements
 *  e.g. require httpMethod: POST, connection must be https.
 *
 * @param route
 * @param meta
 */
const testValidateGoodRequest=(route, meta)=>{
  assert.doesNotThrow(()=>{
    let routeMethod = meta.hasAnnotation("httpMethod") ? meta.getAnnotation("httpMethod")[0].value.toUpperCase() : "GET";
    let isSecure = ((routeMethod === "GET" && meta.hasAnnotation("https")) || routeMethod !== "GET");

    route.validateRequest({
      isSecure: ()=>{return isSecure;},
      httpMethod: routeMethod
    });
  });
};

/**
 * Test that the route DOES throw if the provided http method or connection does not meet the method requirements.
 *
 * @param route
 * @param meta
 */
const testValidateBadRequest = (route, meta)=>{
  let routeMethod = meta.hasAnnotation("httpMethod") ? meta.getAnnotation("httpMethod")[0].value.toUpperCase() : "GET";
  let isSecure = !((routeMethod === "GET" && meta.hasAnnotation("https")) || routeMethod !== "GET");
  if(!isSecure){
    // test the secure connection check
    assert.throws(()=>{
      route.validateRequest({
        isSecure: ()=>{return isSecure;},
        httpMethod: routeMethod
      });
    });
    // http method check
    assert.throws(()=>{
      let alternateMethod = (routeMethod === 'POST') ? "PUT": 'POST';
      route.validateRequest({
        isSecure: ()=>{return isSecure;},
        httpMethod: alternateMethod
      });
    });
  }
};

/**
 * Test that the route can handle sending the request to the appropriate handlers
 *  Also test that the model is set on any methods requiring a model
 *  Also test that the doBefore method is triggered before the handler is triggered.
 *  Also test that if the content should be json, it is converted to json and the json header is set.
 * @param route
 * @param methodMeta
 */
const testHandle = (route, methodMeta)=>{
  let req ={hit: false, doBefore:false, payload: 'test'};
  let res = {headers:[], content: '', modelTest: '',
    toJson:()=>{
      res.addHeader('content-type', 'application/json');
      res.content = JSON.stringify(res.content);
    },
    addHeader:(header, value)=>{res.headers[header] = value;}};
  route.handle(req, res);
  assert.ok(req.hit);
  if(methodMeta.hasAnnotation("doBefore")){
    assert.ok(req.doBefore);
  }
  if(methodMeta.hasAnnotation("model")){
    assert.equal("test", req.model.test);
    assert.equal("test", res.content);
  }
  if(methodMeta.hasAnnotation("json")){
    assert.equal("application/json", res.headers['content-type']);
    assert.equal('{"test":"test"}', res.content);
  }
};

let test = (meta, controllerRoute)=>{
  return ()=>{
    for(let method of meta.methods){
      // Skip a method if it isn't a route. RouteCollector does this automatically.
      let methodMeta = meta.forMethod(method);
      if(!methodMeta.hasAnnotation("route")){
        // Route should fail if associated method has no route annotation
        assert.throws(()=>{let route = new Route(meta, method);});
      } else {
        let route = new Route(meta, method);
        testRoutePaths(route, method, controllerRoute);
        testValidateGoodRequest(route, methodMeta);
        testValidateBadRequest(route, methodMeta);
        testHandle(route, methodMeta);
      }
    }
  };
};

indexMeta.parseFile(mockIndexController, test(indexMeta, "/"));
otherMeta.parseFile(mockOtherController, test(otherMeta, "other"));

