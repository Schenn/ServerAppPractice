const fs = require("fs");
const path = require("path");

const cache = {};

module.exports = function (namespace) {
  let filePath = path.join(process.cwd(), namespace.replace("\\", "/"))+".js";
  let ref = null;
  if(typeof cache[filePath] !== "undefined"){
    ref = cache[filePath];
  } else if(fs.existsSync(filePath)){
    cache[filePath] = require(filePath);
    ref = cache[filePath];
  } else {
    throw `No class found at path:${filePath}`;
  }

  return ref;
};