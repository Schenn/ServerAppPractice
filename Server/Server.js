const StringDecoder = require("string_decoder").StringDecoder;
const Connection = require("./Connection");
const SecureConnection = require("./SecureConnection");
const Request = require("./Request");
const Response = require("./Response");

const _ = Symbol("private");

/**
 * Creates and manages the http and https connections that the application uses.
 */
class Server {
  /**
   * Create a raw server to host connections from.
   *  You must provide a class that knows how to take a route and do something with it.
   */
  constructor(router){
    this[_] = {
      router: router,
      logger: console,
      connections: [],
      environment: '',
      decoder: new StringDecoder('utf-8'),
    };
  }

  /**
   * For logging
   * @param environment
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
   * @param {number} port
   * @param {string|null} key path to the SSH key.
   */
  createConnection(port, key = null){
    let handle = (req, res)=>{
      let request = new Request(req, !!key);
      let response = new Response(res);
      try {
        req.process(()=>{
          this[_].router.handle(request, response);
        });
      } catch(e){
        logger.log(e);
        response.error(405, e);
      }
    };

    let connection = (key) ?
      new SecureConnection(port, handle, key) :
      new Connection(port, handle);

    connection.open();
    this[_].connections.push(connection);
  }
}

/**
 * Create a server and provide it with a request handling callback
 */
module.exports = Server;