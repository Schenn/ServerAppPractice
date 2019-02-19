const path = require("path");
const { createRequireFromPath } = require("module");
const Annotations = require("../NodeAnnotations");

module.exports = class EntityValidator {
  constructor(){
    this._ = Symbol("EntityValidator");
    this[this._] = {
      entity: '',
      validators: {},
      basePath: '',
    };
  }

  set basePath(dir){
    this[this._].basePath = dir;
  }

  cacheRouteEntity(name){
    let metaData = new Annotations.Metadata();
    let file = name + ".js";
    let fullpath = path.join(this[this._].basePath, file);
    metaData.parseFile(fullpath, (entityData)=>{
      for(let propName of entityData.propertyData){
        let propMeta = entityData.forProperty(propName);
        if(!propMeta.hasAnnotation("validator")){
          continue;
        }
        this.addValidator(propName, propMeta.getAnnotation("validator"));
      }
    });
  }

  addValidator(propName, annotations){
    if(typeof this[this._].validators[propName] === "undefined"){
      this[this._].validators[propName] = [];
    }

    this[this._].validators[propName]= annotations;
  }

  validatePaydata(paydata){

  }
};