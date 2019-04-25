const assert = require("assert");
const path = require("path");
const Route = require("../Route");
const Metadata = require("../../NodeAnnotations/Metadata");

let mockIndexController = path.join(process.cwd(), "mocks/MockIndexController.js");
let mockOtherController = path.join(process.cwd(), "mocks/MockOtherController.js");

let indexMeta = new Metadata();
let otherMeta = new Metadata();

const testRoutePaths = (route, meta, method, controllerRoute)=>{
  // for the test classes, the route looks like : route: "method", controller method: "testMethod".
  let methodToRoute = method.replace("test","").toLowerCase();

  assert.ok(route);
  assert.equal(controllerRoute, route.controllerRoute);
  // For the tests, all "index" methods route to path "/" for their controller.
  if(methodToRoute === "index"){
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

const testValidateBadRequest = (route, meta)=>{
  let routeMethod = meta.hasAnnotation("httpMethod") ? meta.getAnnotation("httpMethod")[0].value.toUpperCase() : "GET";
  let isSecure = !((routeMethod === "GET" && meta.hasAnnotation("https")) || routeMethod !== "GET");
  if(!isSecure){
    assert.throws(()=>{
      route.validateRequest({
        isSecure: ()=>{return isSecure;},
        httpMethod: routeMethod
      });
    });

    assert.throws(()=>{
      let alternateMethod = (routeMethod === 'POST') ? "PUT": 'POST';
      route.validateRequest({
        isSecure: ()=>{return isSecure;},
        httpMethod: alternateMethod
      });
    });
  }

};

const testValidateRequest = (route, meta)=>{
  testValidateGoodRequest(route, meta);
  testValidateBadRequest(route, meta);
};

const testHandle = (route, methodMeta)=>{
  let req ={hit: false, doBefore:false};
  let res = {headers:[], content: '', addHeader:(header, value)=>{res.headers[header] = value;}};
  route.handle(req, res);
  assert.ok(req.hit);
  if(methodMeta.hasAnnotation("doBefore")){
    assert.ok(req.doBefore);
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
        testRoutePaths(route, meta, method, controllerRoute);
        testValidateRequest(route, methodMeta);
        testHandle(route, methodMeta);
      }
    }
  };
};

indexMeta.parseFile(mockIndexController, test(indexMeta, "/"));
otherMeta.parseFile(mockOtherController, test(otherMeta, "other"));

