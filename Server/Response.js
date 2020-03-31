/**
 * Wraps the http(s) response object.
 *
 * @type {module.Response}
 */
module.exports = class Response {

  #response = null;
  #headers = [];
  #closed = false;
  statusCode = 200;
  statusMessage = '';
  content = "";


  constructor(resp){
    this.#response = resp;
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
   * Cache a header to add to the response when its time to close the message.
   *
   * @param {string} headerKey
   * @param {string} headerValue
   */
  addHeader(headerKey, headerValue){
    this.#headers += {key: headerKey, value: headerValue};
  }

  /**
   * json stringify the outgoing content
   */
  toJson(){
    this.addHeader('content-type', 'application/json');
    this.content = JSON.stringify(this.content);
  }

  /**
   * Get the Headers
   *
   * @return {*|ResponseHeaders|Array}
   */
  get headers(){
    return this.#headers;
  }

  /**
   * Close the response object and return the resulting content to the client.
   */
  close(){
    this.#closed = true;
    if(this.statusMessage !== ""){
      this.#response.writeHead(this.statusCode, this.statusMessage);
    } else {
      this.#response.writeHead(this.statusCode);
    }
    this.#response.end(this.content);
  }

  /**
   * Has the response been closed due to an error?
   *
   * @return {boolean}
   */
  isOpen(){
    return !this.#closed;
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