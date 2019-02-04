const path = require("path");
const assert = require("assert");
const Collector = require("../Collector");

let mockPath = path.join(process.cwd(), "tests/mocks");

let collector = new Collector();

let cbcount = 0;

let successTimeout = setTimeout(()=>{
  assert.fail("Collector callback never reached.");
}, 2000);

collector.collectFromPath(mockPath,()=>{
  cbcount++;
  assert.strictEqual(cbcount,1);
  assert.strictEqual(collector.namespaces.length, 3);

  for(let name of collector.namespaces){
    let data = collector.classMetadata(name);
    assert.strictEqual(data.methods.length, 3);
    assert.strictEqual(data.propertyData.length, 2);
  }
  clearTimeout(successTimeout);
});