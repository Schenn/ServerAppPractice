const path = require("path");
const assert = require("assert");
const Collector = require("../RouteCollector");
// path to the mock classes
let mockPath = path.join(process.cwd(), "mocks");

let collector = new Collector();

let cbcount = 0;

/**
 * If this timeout is reached, then the collector failed to trigger the callback
 * @type {number}
 */
let successTimeout = setTimeout(()=>{
  assert.fail("Collector callback never reached.");
}, 4000);

collector.buildCache(mockPath).then((router)=>{
  // Validate that the callback is only called once
  cbcount++;
  assert.strictEqual(cbcount,1);
  assert.strictEqual(collector.namespaces.length, 2);

  clearTimeout(successTimeout);

  if(cbcount > 1){
    assert.fail("On Complete callback called more than once.");
  }
});
