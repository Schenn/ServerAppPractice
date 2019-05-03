const Router = require("../Router");
const assert = require("assert");
const path = require("path");
const Route = require("../Route");
const Metadata = require("../../NodeAnnotations/Metadata");

let mockIndexController = path.join(process.cwd(), "mocks/MockIndexController.js");
let mockOtherController = path.join(process.cwd(), "mocks/MockOtherController.js");

let indexMeta = new Metadata();
let otherMeta = new Metadata();

let router = new Router();

let filecount = 0;
let test = (meta)=>{
  filecount++;
  return ()=> {
    for (let method of meta.methods) {
      // Skip a method if it isn't a route. RouteCollector does this automatically.
      let methodMeta = meta.forMethod(method);
      if (methodMeta.hasAnnotation("route")) {
        let route = new Route(meta, method);
        router.addRoute(route);
        assert.ok(router.routeMeta({
          httpMethod: route.httpMethod,
          path: route.routePath
        }));
      }
    }
  }
};
indexMeta.parseFile(mockIndexController).then(()=>{test(indexMeta)});
otherMeta.parseFile(mockOtherController).then(()=>{test(otherMeta)});