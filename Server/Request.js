const url = require("url");
const _ = Symbol("private");

module.exports = class Request {
  constructor(req, secure = false){
    this[_] = {
      req: req,
      isSecure: secure,
      decoder: new StringDecoder('utf-8'),
      parsedUrl: url.parse(this[_].request.url, true),
      payload: null,
    };
  }

  get isSecure(){
    return this[_].isSecure;
  }

  get path(){
    return this[_].parsedUrl.pathname.replace(/^\/+|\/+$/g , '');
  }

  get query(){
    return this[_].parsedUrl.query;
  }

  get httpMethod(){
    return this[_].req.method;
  }

  get headers(){
    return this[_].req.headers;
  }

  process(onReady){
    this[_].req.on('data', (data)=>{
      this[_].payload += this[_].decoder.write(data);
    });
    this[_].req.on('end', ()=>{
      this[_].payload += this[_].decoder.end();
      onReady();
    });
  }
};