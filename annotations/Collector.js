const fs = require("fs");
const path = require("path");
const Comment = require("./Comment");
const Metadata = require("./Metadata");
const commentOpen = '/**';
const commentClose = '*/';

const isJsFile = /((\.js)$)/g;
const classRegex = /((class\s[A-z]+)((?:\s)?)((?:extends\s)([A-z]+\s))?){$/gm;

module.exports = class Collector {

  constructor(){
    this._ = Symbol("Collector");
    this[this._] = {
      metadata:{}
    };
  }

  collectFromPath(fromPath, cb){
    let fullPath = path.join(process.cwd(), fromPath);
    // Does the path point to a file or a directory?
    if(isJsFile.test(fromPath)){
      // file
      fs.readFile(fullPath, (err, content)=>{
        this[this._].metadata[fromPath] = new Metadata();
        this.parseText(content);
        cb();
      });
    } else {
      // directory
      fs.readdir(fullPath, (err, subpaths)=>{
        for(let subpath of subpaths){
          this.collectFromPath(subpath);
        }
        cb();
      });
    }
  }

  parseText(text){
    let className = null;
    let classExtends = null;
    let classNamePhrase = null;
    let classIndex = text.search(classRegex);
    // Get the class name if it exists
    if(classIndex > -1){
      classNamePhrase = text.match(classRegex)[0].replace("{", "").trim();
      let classNameData = classNamePhrase.split(" ");
      className = classNameData[1];
      if(typeof classNameData[3] !== "undefined"){
        classExtends = classNameData[3];
      }
    }
    let index = 0;
    while(index > -1){
      let commentIndexStart = text.indexOf(commentOpen, index);
      // If there's no docblock, there's no annotations to collect.
      if(commentIndexStart === -1) {
        index = commentIndexStart;
        break;
      }



      let commentEnd = text.indexOf(commentClose, commentIndexStart) + commentClose.length;
      let comment = new Comment();
      comment.content = text.substring(commentIndexStart, commentEnd);

      // It's a Class comment
      if(commentEnd < classIndex){

        index = classIndex + classNamePhrase.length;
      } else {
        // Is it a function/method comment?
        let methodEndIndex = text.indexOf("(", commentEnd);
        let method = text.substring(commentEnd, methodEndIndex).trim();

        index = text.indexOf(commentOpen, methodEndIndex) - 1;
      }






    }
  }

};