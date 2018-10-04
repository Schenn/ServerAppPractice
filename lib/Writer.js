const fs = require("fs");
const path = require("path");

const write = function(fh, content, cb){
  fs.writeFile(fh, content, (writeErr)=>{
    if(writeErr){
      cb(writeErr);
      return false;
    }

    return true;
  });
};

const close = function(fh, cb){
  fs.close(fh, (closeError)=>{
    if(closeError){
      cb(closeError);
      return false;
    }
    return true;
  });
};

const truncate = function(fh, cb){
  fs.truncate(fh, (truncErr)=>{
    if(truncErr){
      cb(truncErr);
      return false;
    }
    return true;
  });
};

class Writer {

  static get WRITEOPEN(){
    return 'wx';
  }

  static get APPENDOPEN(){
    return 'r+';
  }

  static get ENCODING(){
    return 'utf8';
  }

  constructor(){
    this._ = Symbol("Writer");
    this[this._] = {
      basePath: '',
      dir: '',
      type: 'json'
    };
  }

  set dataType(type){
    this[this._].type = type;
  }

  // The root directory for the Writer to work in.
  set basePath(basePath){
    this[this._].basePath = path.join(process.cwd(), basePath);
  }

  get basePath(){
    return this[this._].basePath;
  }

  // The subdirectory path for the writer to work in.
  set dir(dir){
    this[this._].dir = dir;
  }

  get dir(){
    return path.join(this.basePath, this[this._].dir);
  }

  fileExistsSync(filename){
    return fs.existsSync(this.filePath(filename));
  }

  filePath(filename){
    return path.join(this.dir, filename);
  }

  /**
   * Override to perform specific formatting to content. Such as json stringify.
   *
   * @param data
   * @return {*}
   */
  prepareData(data){
    return (this[this._].type === 'json') ?
        JSON.stringify(data) :
        data;
  }

  create(filename, data, cb){
    if(this.fileExistsSync(filename)){
      cb(`${filename} already exists.  Cannot create.`);
    } else {
      fs.open(this.filePath(filename), this.constructor.WRITEOPEN, (err, fh)=>{
        if(err || !fh){
          cb(err);
        } else {
          if(write(fh, this.prepareData(data), cb) && close(fh, cb)){
            return false;
          }
        }
      });
    }
  }

  append(fileName, data, cb){
    if(!this.fileExistsSync(fileName)){
      this.create(fileName, data, cb);
    } else {
      fs.open(this.filePath(fileName), this.constructor.APPENDOPEN, (err, fh)=>{
        if(err || !fh){
          cb(err);
        } else {
          if(write(fh, this.prepareData(data), cb) && close(fh, cb)){
            return false;
          }
        }
      });
    }
  }

  readSync(filename, json, cb){
    let data = fs.readFileSync(this.filePath(filename), this.constructor.ENCODING);
    cb((json)? JSON.parse(data) : data);
  }

  read(filename, json, cb){
    fs.readFile(this.filePath(filename), this.constructor.ENCODING, (err, data)=>{
      cb(err, (json)? JSON.parse(data) : data);
    });
  }

  update(filename, data, cb, trunc = true){
    fs.open(this.filePath(filename), this.constructor.APPENDOPEN, (err, fh)=>{
      if(err){
        cb(err);
      } else {
        if(trunc) {
          truncate(fh, cb)
        }
        if(write(fh, this.prepareData(data), cb)){
          return false;
        }
      }
    });
  }

  delete(filename, cb){
    fs.unlink(this.filePath(filename), (err)=>{
      if(err){
        cb(err);
      } else {
        cb(false);
      }
    });
  }
}

module.exports = Writer;