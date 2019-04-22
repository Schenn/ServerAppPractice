const _ = Symbol("Private");

module.exports = class Response {

  constructor(resp){
    this[_] = {
      response: resp,
      statusCode: 200,
      statusMessage: '',
      headers: [],
      content: ''
    };
  }

  setStatus(code, message=''){
    this.statusCode = code;
    this.statusMessage = message;
  }

  set statusCode(code){
    this[_].statusCode = code;
  }

  set statusMessage(message){
    this[_].statusMessage = message;
  }

  get statusCode(){
    return this[_].statusCode;
  }

  get statusMessage(){
    return this[_].statusMessage;
  }

  set content(payload){
    this[_].content = payload;
  }

  get content(){
    return this[_].content;
  }

  addHeader(headerKey, headerValue){
    this[_].headers += {key: headerKey, value: headerValue};
  }

  get headers(){
    return this[_].headers;
  }

  close(){
    if(this.statusMessage !== ""){
      this[_].response.writeHead(this.statusCode, this.statusMessage);
    } else {
      this[_].response.writeHead(this.statusCode);
    }
    this[_].response.end(this.content);
  }

  error(code, message){
    this.statusCode = code;
    this.statusMessage = message;
    this.close();
  }

};