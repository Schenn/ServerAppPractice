const fs = require("fs");
const path = require("path");

const _ = Symbol("private");

/**
 * Write data to a file.
 * @param fh
 * @param {string} content
 * @param {function} onError On Error callback
 * @param {function} cb on complete callback
 */

const write = function(fh, content, onError, cb){
  fs.writeFile(fh, content, (writeErr)=>{
    if(writeErr){
      onError(writeErr);
    }
    cb();
  });
};

/**
 * Close the file.
 *
 * @param fh File Handler
 * @param {function} onError on Error callback
 * @param {function} cb on complete callback
 */
const close = function(fh, onError, cb){
  fs.close(fh, (closeError)=>{
    if(closeError){
      onError(closeError);
    }
    cb();
  });
};

/**
 * Truncate a file.
 *
 * @param fh
 * @param {function} cb On Error callback
 */
const truncate = function(fh, onError, cb){
  fs.truncate(fh, (truncErr)=>{
    if(truncErr){
      onError(truncErr);
    }
    cb();
  });
};

/**
 * The Writer class is used for writing data to a file.
 *  This reduces the need to put fs and path everywhere and allows for reusable code with other tools.
 *  This tool was written to aid in the development and testing of the overall project.
 *
 *  @
 */
class Writer {

  /**
   * @const
   * @return {string}
   * @constructor
   */
  static get WRITEOPEN(){
    return 'wx';
  }

  /**
   * @const
   * @return {string}
   * @constructor
   */
  static get APPENDOPEN(){
    return 'r+';
  }

  /**
   * @const
   * @return {string}
   * @constructor
   */
  static get ENCODING(){
    return 'utf8';
  }

  constructor(){
    this[_] = {
      basePath: '',
      dir: '',
      type: 'json',
      onError: (err)=>{console.log(err)}
    };
  }

  set dataType(type){
    this[_].type = type;
  }

  // The root directory for the Writer to work in.
  set basePath(basePath){
    this[_].basePath = path.join(process.cwd(), basePath);
  }

  get basePath(){
    return this[_].basePath;
  }

  // The subdirectory path for the writer to work in.
  set directory(dir){
    this[_].directory = dir;
  }

  set onError(cb){
    this[_].onError = cb;
  }

  get directory(){
    return path.join(this.basePath, this[_].directory);
  }

  /**
   * Check synchronously that a file exists.
   * @param {string} filename
   * @return {boolean}
   */
  fileExistsSync(filename){
    return fs.existsSync(this.filePath(filename));
  }

  /**
   * The full path to a file.
   *
   * @param {string} filename
   * @return {string}
   */
  filePath(filename){
    return path.join(this[_].directory, filename);
  }

  /**
   * Override to perform specific formatting to content. Such as json stringify.
   *
   * @param {string | object} data
   * @return {string}
   */
  prepareData(data){
    return (this[_].type === 'json') ?
        JSON.stringify(data) :
        data;
  }

  /**
   * Create a new file to write in.
   *
   * @param {string} filename
   * @param {string|object} data
   * @param {function} cb on complete callback
   */
  create(filename, data, cb){
    if(this.fileExistsSync(filename)){
      this[_].onError(`${filename} already exists.  Will not create.`);
    } else {
      fs.open(this.filePath(filename), Writer.WRITEOPEN, (err, fh)=>{
        if(err || !fh){
          this[_].onError(err);
        } else {
          write(fh, this.prepareData(data), this[_].onError, ()=>{close(fh, this[_].onError, cb);});
        }
      });
    }
  }

  /**
   * Append data to the end of a file. If the file doesn't exist, it is created.
   *
   * @param {string} fileName
   * @param {string|object} data
   * @param {function} cb On Complete Handler
   */
  append(fileName, data, cb){
    if(!this.fileExistsSync(fileName)){
      this.create(fileName, data, cb);
    } else {
      fs.open(this.filePath(fileName), Writer.APPENDOPEN, (err, fh)=>{
        if(err || !fh){
          this[_].onError(err);
        } else {
          write(fh, this.prepareData(data), this[_].onError, ()=>{close(fh, this[_].onError, cb);});
        }
      });
    }
  }

  /**
   * Read from a file synchronously
   *
   * @param {string} filename
   * @param {boolean} json Is the filedata in json format?
   * @param {function} cb On Complete Handler
   */
  readSync(filename, json, cb){
    let data = fs.readFileSync(this.filePath(filename), Writer.ENCODING);
    cb((json)? JSON.parse(data) : data);
  }

  /**
   * Read from a file asynchronously.
   *
   * @param {string} filename
   * @param {boolean} json Whether to parse the filecontent as json or not.
   * @param {function} cb error handler
   */
  read(filename, json, cb){
    fs.readFile(this.filePath(filename), Writer.ENCODING, (err, data)=>{
      if(err){
        this.onError(err);
      } else {
        cb((json)? JSON.parse(data) : data);
      }
    });
  }

  /**
   * Update a file's contents asynchronously
   * @param {string} filename
   * @param {string | object} data
   * @param {function} cb On Complete Handler
   * @param {boolean} trunc Whether to truncate the file before appending.
   */
  update(filename, data, cb, trunc = true){
    fs.open(this.filePath(filename), Writer.APPENDOPEN, (err, fh)=>{
      if(err){
        this[_].onError(err);
      } else {
        let update = ()=>{
          write(fh, this.prepareData(data), this[_].onError, ()=>{close(fh, this[_].onError, cb);});
        };
        if(trunc) {
          truncate(fh, this.onError, update)
        } else {
          update();
        }
      }
    });
  }

  /**
   * Delete a file asynchronously
   *
   * @param {string} filename
   * @param {function} onError on error handler.
   * @param {function} cb on complete handler
   */
  delete(filename, onError, cb){
    fs.unlink(this.filePath(filename), (err = false)=>{
        cb(err);
    });
  }
}

module.exports = Writer;