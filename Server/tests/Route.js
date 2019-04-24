const assert = require("assert");
const path = require("path");
const Route = require("../Route");
const Metadata = require("../../NodeAnnotations/Metadata");

let mockClassPath = path.join(process.cwd(), "mocks/MockController.js");

let controllerMeta = new Metadata();
controllerMeta.parseFile(mockClassPath, ()=>{
  for(let method of controllerMeta.methods){
    let route = new Route(controllerMeta, method);
    assert.ok(route);
    assert.equal("/", route.controllerRoute);
  }
});

