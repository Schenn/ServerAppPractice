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
   *
   * @param {Router} router The router class which handles routing incoming requests to the appropriate methods.
   */
  constructor(router){
    this[_] = {
      router: router,
      logger: console,
      connections: [],
      environment: '',
    };
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
      let request = new Request(req, !!key);
      let response = new Response(res);
      try {
        req.init(()=>{
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

module.exports = Server;