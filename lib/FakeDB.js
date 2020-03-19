import Database from "Database";
import fs from "fs";
import path from "path";

const BASEDIR = "baseDir";
const SUBPATH = "subPath";
const FILENAME = "fileName";

class FakeDB extends Database {

  constructor(connectionArgs = {}){
    if(typeof connectionArgs.baseDir === "undefined"){
      connectionArgs.baseDir = __dirname;
    }
    super(connectionArgs);
  }

  connect(){
    let baseDir = this.connectionParam(BASEDIR);
    let subPath = this.connectionParam(SUBPATH);
    let fileName = this.connectionParam(FILENAME);

  }

  disconnect(){

  }

  query(queryString = ""){

  }

}

module.exports = FakeDB;