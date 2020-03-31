const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const qs = require("querystring");
const Autoloader = require("../Server/Autoloader");

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

  #req = null;
  #isSecure = false;
  #decoder = new StringDecoder('utf-8');
  #parsedUrl = {};
  #payload = "";
  #dependencies = {};

  /**
   * @param req
   * @param {boolean} secure
   */
  constructor(req, secure = false){
    this.#req = req;
    this.#isSecure = secure;
    this.#parsedUrl = url.parse(req.url, true);
  }

  static get METHODS(){
    return methods;
  }

  get METHODS(){
    return methods;
  }

  /**
   * If the request was created by a Secure Connection instead of a http connection.
   *
   * @return {boolean}
   */
  get isSecure(){
    return this.#isSecure;
  }

  /**
   * Get the path from the url.
   *
   * @return {string | *}
   */
  get path(){
    return this.#parsedUrl.pathname.replace(/^(\/+)|(\/$)/g , '');
  }

  /**
   * Get the query parameters from the url
   *
   * @return {*}
   */
  get query(){
    return this.#parsedUrl.query;
  }

  /**
   * Get the http method used to make the request (GET, POST, DELETE, PUT)
   * @return {*}
   */
  get httpMethod(){
    return this.#req.method;
  }

  /**
   * Get the headers from the request
   * @return {*|ResponseHeaders|Array}
   */
  get headers(){
    return this.#req.headers;
  }

  /**
   * Get the incoming content from the request
   * @return {*|null}
   */
  get payload(){
    return this.#payload;
  }

  /**
   * Start listening for data and end events. When the request has finished parsing, trigger the onReady callback which
   *  should route the request to an appropriate handler.
   *
   * @param {function} onReady
   */
  init(onReady){
    this.#req.on('data', (data)=>{
      this.#payload += this.#decoder.write(data);
    });
    this.#req.on('end', ()=>{
      this.#payload += this.#decoder.end();
      switch(this.#req.headers['content-type']){
        case 'application/json':
          this.#payload = JSON.parse(this.#payload);
          break;
        case 'multipart/form-data':
          this.#payload = qs.parse(this.#payload);
          break;
        default:
          // leave it alone
          break;
      }
      onReady();
    });
  }
};