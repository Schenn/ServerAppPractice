const Annotation = require("./Annotation");
const annotationRegex = /(?:\s?\*\s?)(@\w+)(?:\s*=\s*|\s)?(({\w*})(?:\s))?(\S+)/g;

module.exports = class Comment {

  constructor(text){
    this.annotations = {};
  }

  set content(text){
    let annotationMatches = text.match(annotationRegex);
    for (let expression in annotationMatches){
      let annotation = new Annotation(expression.trim());
      this.annotations[annotation.name] = annotation;
    }
  }

  hasAnnotations(){
    return Object.keys(this.annotations).length > 0;
  }

  hasAnnotation(annotation){
    return typeof this.annotations[annotation] !== "undefined";
  }

  getAnnotation(annotation){
    return this.annotations[annotation];
  }
};