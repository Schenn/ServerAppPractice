const Connection = require("./Connection");
const SecureConnection = require("./SecureConnection");
const Request = require("./Request");
const Response = require("./Response");

/**
 * Creates and manages the http and https connections that the application uses.
 */
module.exports = class Server {

  handler = ()=>{};
  logger = console;
  #connections = [];
  environment = "";

  /**
   * Create a raw server to host connections from.
   *  You must provide a class that knows how to take a route and do something with it.
   *
   * @param {Router} router The router class which handles routing incoming requests to the appropriate methods.
   */
  constructor(handler=()=>{}, environment=""){
    this.handler = handler;
    this.environment = environment;
  }

  /**
   * Create an http connection
   * @param {number} port The port to listen on.
   * @param {{key:string, cert: string}|null} key path to the SSH key.
   */
  createConnection(port, key = null){
    let handle = (req, res)=>{
      this.handle(new Request(req, !!key), new Response(res));
    };

    let connection = (key) ?
      new SecureConnection(port, handle, key) :
      new Connection(port, handle);

    connection.open();
    this.#connections.push(connection);
  }

  /**
   * A request was heard from one of the connections. Handle it.
   *
   * @param {module.Request} req
   * @param {module.Response} res
   * @throws If no router is set to handle incoming requests when the first request is made.
   */
  handle(req, res){
    if(!this.handler){
      throw Error("No handler set to handle incoming requests.");
    }
    req.init(()=>{
      try {
        this.handler(req, res);
      } catch(e){
        this.logger.log(e);
        res.error(405, e);
      }
    });
  }
};