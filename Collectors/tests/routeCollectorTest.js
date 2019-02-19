const path = require("path");
const assert = require("assert");
const Collector = require("../RouteCollector");
// path to the mock classes
let mockPath = path.join(process.cwd(), "tests/mocks");

let collector = new Collector();

let cbcount = 0;

collector.buildCache(path.join(process.cwd(), "tests/mocks"), (routes)=>{
  // Validate that the callback is only called once
  cbcount++;
  assert.strictEqual(cbcount,1);
  assert.strictEqual(collector.namespaces.length, 2);
  assert.strictEqual(Object.keys(routes.httpRoutes).length, 4);
  assert.strictEqual(Object.keys(routes.httpsRoutes).length, 2);

  clearTimeout(successTimeout);

  if(cbcount > 1){
    assert.fail("On Complete callback called more than once.");
  }
});

/**
 * If this timeout is reached, then the collector failed to trigger the callback
 * @type {number}
 */
let successTimeout = setTimeout(()=>{
  assert.fail("Collector callback never reached.");
}, 2000);