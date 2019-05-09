const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const Autoloader = require("../Server/Autoloader");

const _ = Symbol("private");

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
      payload: null,
      form: null
    };
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
    return this[_].parsedUrl.pathname.replace(/^\/+|\/+$/g , '');
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

  /**
   * Set the form which the request should carry.
   * @param {string} targetForm
   */
  useForm(target){
    let targetForm = Autoloader(target);
    this[_].form = new targetForm(this[_].payload);
  }

  /**
   * Get the form instance on the request.
   * @return {*|null}
   */
  get form(){
    return this[_].form;
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