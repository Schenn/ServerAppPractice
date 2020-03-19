const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const qs = require("querystring");
const Autoloader = require("../Server/Autoloader");

const _ = Symbol("private");
const methods = {
  "get": "GET",
  "put": "PUT",
  "post": "POST",
  "delete": "DELETE"
};

/**
 * Wrap a request object
 * @type {module.Request}
 */
module.exports = class Request {
  /**
   * @param req
   * @param {boolean} secure
   */
  constructor(req, secure = false){
    this[_] = {
      req: req,
      isSecure: secure,
      decoder: new StringDecoder('utf-8'),
      parsedUrl: url.parse(req.url, true),
      payload: '',
      forms: []
    };
  }

  static get METHODS(){
    return methods;
  }

  get METHODS(){
    return this.constructor.METHODS;
  }

  /**
   * If the request was created by a Secure Connection instead of a http connection.
   *
   * @return {boolean}
   */
  get isSecure(){
    return this[_].isSecure;
  }

  /**
   * Get the path from the url.
   *
   * @return {string | *}
   */
  get path(){
    return this[_].parsedUrl.pathname.replace(/^(\/+)|(\/$)/g , '');
  }

  /**
   * Get the query parameters from the url
   *
   * @return {*}
   */
  get query(){
    return this[_].parsedUrl.query;
  }

  /**
   * Get the http method used to make the request (GET, POST, DELETE, PUT)
   * @return {*}
   */
  get httpMethod(){
    return this[_].req.method;
  }

  /**
   * Get the headers from the request
   * @return {*|ResponseHeaders|Array}
   */
  get headers(){
    return this[_].req.headers;
  }

  /**
   * Get the incoming content from the request
   * @return {*|null}
   */
  get payload(){
    return this[_].payload;
  }

  addForm(form){
    this[_].forms += form;
  }

  get forms(){
    return this[_].forms;
  }

  /**
   * Start listening for data and end events. When the request has finished parsing, trigger the onReady callback which
   *  should route the request to an appropriate handler.
   *
   * @param {function} onReady
   */
  init(onReady){
    this[_].req.on('data', (data)=>{
      this[_].payload += this[_].decoder.write(data);
    });
    this[_].req.on('end', ()=>{
      this[_].payload += this[_].decoder.end();
      onReady();
    });
  }
};