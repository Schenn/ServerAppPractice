const Connection = require("./Connection");
const SecureConnection = require("./SecureConnection");
const Request = require("./Request");
const Response = require("./Response");

const _ = Symbol("private");

/**
 * Creates and manages the http and https connections that the application uses.
 */
module.exports = class Server {
  /**
   * Create a raw server to host connections from.
   *  You must provide a class that knows how to take a route and do something with it.
   *
   * @param {Router} router The router class which handles routing incoming requests to the appropriate methods.
   */
  constructor(){
    this[_] = {
      handler: null,
      logger: console,
      connections: [],
      environment: '',
    };
  }

  /**
   * Set the Handler the server should use to handle requests
   *
   *  {handle:(request, response)=>{ doSomethingWithRequest(request); doSomethingWithResponse(response); }}
   * @param {Object} handler
   */
  set handler(handler){
    this[_].handler = handler;
  }

  /**
   * Memoize the current environment for logging.
   *
   * @param {String | Object} environment
   */
  set environment(environment){
    this[_].environment = environment;
  }

  /**
   * Use a class other than the console for logging errors and messages.
   *
   * @param {Object} logger
   */
  set logger(logger){
    this[_].logger = logger;
  }

  /**
   * Create an http connection
   * @param {number} port The port to listen on.
   * @param {string|null} key path to the SSH key.
   */
  createConnection(port, key = null){
    let handle = (req, res)=>{
      this.handle(new Request(req, !!key), new Response(res));
    };

    let connection = (key) ?
      new SecureConnection(port, handle, key) :
      new Connection(port, handle);

    connection.open();
    this[_].connections.push(connection);
  }

  /**
   * A request was heard from one of the connections. Handle it.
   *
   * @param {module.Request} req
   * @param {module.Response} res
   * @throws If no router is set to handle incoming requests when the first request is made.
   */
  handle(req, res){
    if(!this[_].handler){
      throw Error("No handler set to handle incoming requests.");
    }
    try {
      req.init(()=>{
        this[_].handler(req, res);
      });
    } catch(e){
      this[_].logger.log(e);
      res.error(405, e);
    }
  }
};