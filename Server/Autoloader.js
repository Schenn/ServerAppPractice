const fs = require("fs");
const path = require("path");

const cache = new Map();

module.exports = function (namespace) {
  let filePath = path.join(process.cwd(), namespace.replace("\\", "/"))+".js";
  let ref = null;
  if(typeof cache.get(filePath) !== "undefined"){
    ref = cache.get(filePath);
  } else if(fs.existsSync(filePath)){
    cache.set(filePath, require(filePath));
    ref = cache.get(filePath);
  } else {
    throw `No class found at path:${filePath}`;
  }

  return ref;
};