const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const http = require("http");
const https = require("https");
const fs = require("fs");

/**
 * Handles the response end for an http connection.
 */
class Server {
  constructor(router, httpPort){
    this.router = router;
    this._ = Symbol("server");
    this[this._] = {
      httpConnection:null,
      httpsConnection:null,
      path: '',
      method: '',
      query: '',
      headers: '',
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

  get path(){
    return this[this._].path;
  }

  get method(){
    return this[this._].method;
  }

  get query(){
    return this[this._].query;
  }

  get headers(){
    return this[this._].headers;
  }

  set security(securityConfig){
    if(fs.existsSync(securityConfig.keycert)){
      this[this._].key.key = fs.readFileSync(securityConfig.key);
      this[this._].key.cert = fs.readFileSync(securityConfig.cert);
      this[this._].httpsPort = securityConfig.port;
    }
  }

  createConnections(environment){
    this[this._].httpConnection = http.createServer(this.handleHttp.bind(this));
    this[this._].httpConnection.listen(this[this._].httpPort, ()=>{
      console.log(`The server: environment: ${environment} is listening on port ${this[this._].httpPort}`);
    });

    if(this[this._].key.key !== null && this[this._].key.cert !== null && this[this._].httpsPort !== -1){
      this[this._].httpsConnection = https.createServer(this[this._].key, this.handleHttps.bind(this));
      this[this._].httpsConnection.listen(this[this._].httpsPort, ()=>{
        console.log(`The server: environment: ${environment} is listening for secure connections on port ${this[this._].httpsPort}`);
      });
    } else {
      console.log("No security configuration found. Skipping https connection.");
    }
  }

  buffer(data){
    this[this._].buffer += this[this._].decoder.write(data)
  }

  handleHttp(req, res){
    this.setRequestData(req);
    this.handle(req, res);
  }

  handleHttps(req, res){
    this.setRequestData(req);
    this.handle(req, res, true);
  }

  setRequestData(req){
    // Get the request's path from the request's url string
    // true argument tells parse function to collect the query string as a query object
    let parsed = url.parse(req.url, true);
    this[this._].path = parsed.pathname.replace(/^\/+|\/+$/g , '');
    this[this._].method = req.method;
    this[this._].query = parsed.query;
    this[this._].headers = req.headers;
  }

  handle(req, res, https = false){
    let validity = this[this._].router.validateRequest(this[this._].path, this[this._].method, https);
    if(!validity.isValid){
      this.closeResponse(res, {status: 405, message: validity.message});
    } else {
      // Paydata (form-data), is read as a bitstream
      // Asynchronous Stream reading, have to wait for the end of the stream before you can return a response to the user.
      //  data event is triggered as the request parses some amount of data.
      //  If there's no paydata, the 'data' event is never triggered. However, the 'end' event is.
      // That content is cached in the buffer variable above, until the end event occurs.
      //  the end event is triggered when the end of the payload string is reached.
      //  If there is no payload string, the event is triggered immediately.
      req.on('data', (data)=>{
        this.buffer(data);
      });
      req.on('end',()=>{
        this.end(req, res, https);
      });
    }
  }

  end(req, res, https=false){

    this[this._].buffer += this[this._].decoder.end();
    let data = {
      'path': this.path,
      'query': this.query,
      'method': this.method,
      'headers': this.headers,
      'payload': this[this._].buffer
    };

    this[this._].router.handle(data, (status, payload, headers)=>{
      for(let header of headers){
        res.setHeader(header.key, header.value);
      }

      this.closeResponse(res, {status: status, message: ''}, payload);
    }, https);
  }

  closeResponse(res, status, payload = null){
    if(status.message !== ''){
      res.writeHead(status.code, status.message);
    } else {
      res.writeHead(status.code);
    }
    res.end(payload);
  }
}

/**
 * Create a server and provide it with a request handling callback
 */
module.exports = Server;