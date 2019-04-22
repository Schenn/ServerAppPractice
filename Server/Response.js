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

  /**
   * Set the Response status
   *
   * @param {number} code
   * @param {String} message
   */
  setStatus(code, message=''){
    this.statusCode = code;
    this.statusMessage = message;
  }

  /**
   * Set the response status code
   * @param {number} code
   */
  set statusCode(code){
    this[_].statusCode = code;
  }

  /**
   * Set the response status message
   *
   * @param {string} message
   */
  set statusMessage(message){
    this[_].statusMessage = message;
  }

  /**
   * Get the status code
   * @return {number}
   */
  get statusCode(){
    return this[_].statusCode;
  }

  /**
   * Get the status message
   * @return {string}
   */
  get statusMessage(){
    return this[_].statusMessage;
  }

  /**
   * Set the content to return to the client.
   *
   * @param {string} payload
   */
  set content(payload){
    this[_].content = payload;
  }

  /**
   * Get the content to return to the client
   * @return {string}
   */
  get content(){
    return this[_].content;
  }

  /**
   * Cache a header to add to the response when its time to close the message.
   *
   * @param {string} headerKey
   * @param {string} headerValue
   */
  addHeader(headerKey, headerValue){
    this[_].headers += {key: headerKey, value: headerValue};
  }

  /**
   * Get the Headers
   *
   * @return {*|ResponseHeaders|Array}
   */
  get headers(){
    return this[_].headers;
  }

  /**
   * Close the response object and return the resulting content to the client.
   */
  close(){
    if(this.statusMessage !== ""){
      this[_].response.writeHead(this.statusCode, this.statusMessage);
    } else {
      this[_].response.writeHead(this.statusCode);
    }
    this[_].response.end(this.content);
  }

  /**
   * There was an error when handling the request
   * @param {number} code
   * @param {string} message
   */
  error(code, message){
    this.statusCode = code;
    this.statusMessage = message;
    this.close();
  }

};