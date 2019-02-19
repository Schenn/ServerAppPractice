const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const http = require("http");
const https = require("https");
const fs = require("fs");

const _ = Symbol("private");

/**
 * Creates and manages the http and https connections that the application uses.
 */
class Server {
  /**
   * Create a raw server to host connections from.
   *  You must provide a class that knows how to take a route and do something with it.
   *
   * @param {Router} router
   * @param {string|int} httpPort
   * @todo Instead of a single http and https connection, allow multiple connections of any type as long as there are no port conflicts.
   */
  constructor(httpPort){
    this[_] = {
      router: null,
      httpConnection:null,
      httpsConnection:null,
      request: null,
      response: null,
      parsedUrl: null,
      buffer: '',
      decoder: new StringDecoder('utf-8'),
      httpPort: httpPort,
      httpsPort: -1,
      key: {
        key: null,
        cert: null
      }
    };
  }

  set router(router){
    this[_].router = router;
  }

  /**
   * The path being routed
   * @return {string}
   */
  get path(){
    return this[_].parsedUrl.pathname;
  }

  /**
   * The current http method
   * @return {string}
   */
  get method(){
    return this[_].request.method;
  }

  /**
   * The Post/Put/Delete parameters.
   * @return {array}
   */
  get query(){
    return this[_].query.parsedUrl.query;
  }

  /**
   * The headers for the current request
   * @return {*|ResponseHeaders}
   */
  get headers(){
    return this[_].request.headers;
  }

  /**
   * Set the security information for the http connections.
   *
   * @param {object} securityConfig
   */
  set security(securityConfig){
    if(fs.existsSync(securityConfig.key)){
      this[_].key.key = fs.readFileSync(securityConfig.key);
      this[_].key.cert = fs.readFileSync(securityConfig.cert);
      this[_].httpsPort = securityConfig.port;
    }
  }

  /**
   * Create the http and https connections and start listening for requests.
   *
   * @param {string} environment
   */
  createConnections(environment){
    this[_].httpConnection = http.createServer(this.handleHttp.bind(this));
    this[_].httpConnection.listen(this[_].httpPort, ()=>{
      console.log(`The server: environment: ${environment} is listening on port ${this[_].httpPort}`);
    });

    if(this[_].key.key !== null && this[_].key.cert !== null && this[_].httpsPort !== -1){
      this[_].httpsConnection = https.createServer(this[_].key, this.handleHttps.bind(this));
      this[_].httpsConnection.listen(this[_].httpsPort, ()=>{
        console.log(`The server: environment: ${environment} is listening for secure connections on port ${this[_].httpsPort}`);
      });
    } else {
      console.log("No security configuration found. Skipping https connection.");
    }
  }

  /**
   * Appreciate the bitstream data from the request
   * @param data
   */
  buffer(data){
    this[this._].buffer += this[_].decoder.write(data)
  }

  /**
   * Request from the http connection heard
   *
   * @param req
   * @param res
   */
  handleHttp(req, res){
    this.setRequestData(req, res);
    this.handle();
  }

  /**
   * Request from the https connection heard.
   *
   * @param req
   * @param res
   */
  handleHttps(req, res){
    this.setRequestData(req, res, true);
    this.handle();
  }

  /**
   * Cache the request data
   *
   * @param req
   * @param res
   * @param isSecure
   */
  setRequestData(req, res, isSecure=false){
    // Get the request's path from the request's url string
    // true argument tells parse function to collect the query string as a query object
    this[_].parsedUrl = url.parse(req.url, true);
    this[_].parsedUrl.pathname = this[_].parsedUrl.pathname.replace(/^\/+|\/+$/g , '');
    this[_].request = req;
    this[_].response = res;
    this[_].secureRequest = isSecure;
  }

  /**
   * Start processing a request
   */
  handle(){
    let validity = this[_].router.validateRequestMethod(this.path, this.method, this[_].secureRequest);
    if(!validity.isValid){
      this.closeResponse({code: 405, message: validity.message});
    } else {
      // Paydata (form-data), is read as a bitstream
      // Asynchronous Stream reading, have to wait for the end of the stream before you can return a response to the user.
      //  data event is triggered as the request parses some amount of data.
      //  If there's no paydata, the 'data' event is never triggered. However, the 'end' event is.
      // That content is cached in the buffer variable above, until the end event occurs.
      //  the end event is triggered when the end of the payload string is reached.
      //  If there is no payload string, the event is triggered immediately.
      this[_].request.on('data', (data)=>{
        this.buffer(data);
      });
      this[_].request.on('end',()=>{
        this.end();
      });
    }
  }

  /**
   * Request has finished buffering,
   *  ask the router to trigger the callback for the given route.
   */
  end(){

    this[_].buffer += this[_].decoder.end();
    let data = {
      'path': this.path,
      'query': this.query,
      'method': this.method,
      'headers': this.headers,
      'isSecure': this[_].secureRequest,
      'payload': this[_].buffer
    };

    this[_].router.handle(data, (status=200, payload=null, headers=[])=>{
      for(let header of headers){
        this[_].response.setHeader(header.key, header.value);
      }

      this.closeResponse({code: status, message: ''}, payload);
    }, this[_].secureRequest);
  }

  /**
   * Return the response to the user.
   *
   * @param status
   * @param payload
   */
  closeResponse(status, payload = null){
    if(status.message !== ''){
      this[_].response.writeHead(status.code, status.message);
    } else {
      this[_].response.writeHead(status.code);
    }
    this[_].response.end(payload);
  }
}

/**
 * Create a server and provide it with a request handling callback
 */
module.exports = Server;