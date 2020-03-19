const Database = require("../Database/Database");
const Writer = require("./Writer");
const Enumerable = require("linq");

const BASEDIR = "baseDir";
const SUBPATH = "subPath";
const FILENAME = "fileName";

const _ = Symbol("private");

const wherePass = function (entry, where) {
  let passed = true;
  for(let i = 0; i < where.length; i++){
    let validator = where[i];
    // if we haven't hit a false yet, keep checking.
    if(passed){
      if(!(validator(entry))){
        passed = false;
      }
    }
  }
  return passed;
};

class FakeDB extends Database {

  constructor(connectionArgs = {}){
    if(typeof connectionArgs.baseDir === "undefined"){
      connectionArgs.baseDir = __dirname;
    }
    super(connectionArgs);
    this[_] = {
      fh: null,
      writer: new Writer()
    };
  }

  /**
   * "Connect" to the database.
   *  For FakeDB, this checks to see if the database file exists, and opens a filehandler for it.
   *
   * @param {function} cb
   * @param {object} fixtures data to start the db with
   */
  connect(cb, fixtures) {
    this[_].writer.basePath = this.connectionParam(BASEDIR);
    this[_].writer.directory = this.connectionParam(SUBPATH);
    let fileName = this.connectionParam(FILENAME);
    this[_].writer.onError = this.addError.bind(this);
    if(this.errors.length === 0){
      let createCB = ()=>{this[_].writer.create(fileName, fixtures, cb)};
      if(!this[_].writer.fileExistsSync(fileName)) {
        createCB();
      } else {
        this[_].writer.delete(fileName, this.addError.bind(this), createCB);
      }
    }
  }

  /**
   * "Disconnect" from the Database
   *  For FakeDB, this resets the writer instance.
   *
   * @param {function} cb
   */
  disconnect(cb){
    this[_].writer = new Writer();
    cb();
  }

  /**
   * Perform a "query" on the data in the database file.
   *  In FakeDB, this does nothing.
   * @param queryString
   * @param cb
   */
  query(queryString = "", cb){

  }

  /***
   * Get data from the db.
   * @param selectArgs
   * @param cb
   */
  select(selectArgs, cb){
    let fileName = this.connectionParam(FILENAME);
    this[_].writer.read(fileName, true, (data)=>{
      let table = selectArgs.table;
      let where = selectArgs.where || [];
      let what = selectArgs.columns || [];

      let tableData = data[table];
      let output = [];
      tableData.forEach((entry, index)=>{
        if(where.length > 0) {
          if(wherePass(entry, where)){
            if(what.length > 0){
              let out = {};
              for(let column of what){
                out[column] = entry[column];
              }
              output.push(out);
            } else {
              output.push(entry);
            }
          }
        } else {
          output.push(entry);
        }

        if(index === tableData.length - 1){
          cb(output);
        }
      });
    });
  }

  insert(insertArgs, cb){
    let fileName = this.connectionParam(FILENAME);
    this[_].writer.read(fileName, true, (data)=>{
      let table = insertArgs.table;
      data[table] = [...data[table],...insertArgs.content];
      this[_].writer.update(fileName, data, cb,true)
    });

  }

  update(updateArgs, cb){
    let fileName = this.connectionParam(FILENAME);
    this[_].writer.read(fileName, true, (data)=> {
      let table = updateArgs.table;
      let tableData = data[table];
      Enumerable.from(tableData).where((entry)=>{
        return wherePass(entry, updateArgs.where);
      }).forEach((entry, i)=>{
        let updatable = Object.keys(updateArgs.update);
        for(let updateColumn of updatable){
          entry[updateColumn] = updateArgs.update[updateColumn];
        }
        tableData[i] = entry;
      });
      data[table] = tableData;
      this[_].writer.update(fileName, data, cb, true);
    });
  }

  delete(deleteArgs, cb){
    let fileName = this.connectionParam(FILENAME);
    this[_].writer.read(fileName, true, (data)=> {
      let table = deleteArgs.table;
      let tableData = data[table];
      Enumerable.from(tableData).where((entry)=>{
        return wherePass(entry, deleteArgs.where);
      }).forEach((entry, i)=>{
        tableData.splice(i, 1);
      });
      data[table] = tableData;
      this[_].writer.update(fileName, data, cb, true);
    });
  }
}

module.exports = FakeDB;