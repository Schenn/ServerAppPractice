const fs = require("fs");
const path = require("path");

module.exports = function (namespace) {
  let filePath = path.join(process.cwd(), namespace.replace("\\", "/"))+".js";
  if(fs.existsSync(filePath)){
    return require(filePath);
  } else {
    throw `No class found at path:${filePath}`;
  }
};