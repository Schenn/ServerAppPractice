const http = require("http");
const url = require("url");
const env = require("./config");
const StringDecoder = require("string_decoder").StringDecoder;

/**
 * Remove leading and trailing slashes
 * @param {string} pathname
 * @return {string}
 */
const noSlashes = function(pathname){
  return pathname.replace(/^\/+|\/+$/g , '');
};

// This is literally all it takes to create a node server and url parser.
// After this, its just about routing to the appropriate controllers
// So... Easy
// Think of this callback as the content of index.php
/**
 * Create a server and provide it with a request handling callback
 */
const server = http.createServer((req, res)=>{
  // Get the request's path from the request's url string
  // true argument tells parse function to collect the query string as a query object
  let parsed = url.parse(req.url, true);
  let clean = noSlashes(parsed.pathname);
  let method = req.method;
  let query = parsed.query;
  let headers = req.headers;

  // Get the payload from the request
  let decoder = new StringDecoder('utf-8');
  let buffer = '';

  // Paydata (form-data), is read as a bitstream
  // Asynchronous Stream reading, have to wait for the end of the stream before you can return a response to the user.
  //  data event is triggered as the request parses some amount of data.
  //  If there's no paydata, the 'data' event is never triggered. However, the 'end' event is.
  // That content is cached in the buffer variable above, until the end event occurs.
  //  the end event is triggered when the end of the payload string is reached.
  //  If there is no payload string, the event is triggered immediately.
  req.on('data', (data)=>{
    buffer += decoder.write(data);
  });
  req.on('end', ()=>{
    buffer += decoder.end();


    let routeHandle = typeof(router[clean]) !== "undefined" ? router[clean] : handlers.notFound;

    let data = {
      'path': clean,
      'query': query,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    routeHandle(data, (status = 200, payload={})=>{
      let paydata = JSON.stringify(payload);
      // set header must be called before write-head, otherwise error
      res.setHeader('content-type', 'application/json');
      res.writeHead(status);
      res.end(paydata);
    });
  });

});

server.listen(env.port, ()=>{
  console.log(`The server: environment: ${env.env} is listening on port ${env.port}`);
});

const handlers = {
  sample: (data, cb)=>{
    cb(406, {'name': 'sample', 'foo': 'bar'});
  },
  notFound: (data, cb)=>{
    cb(404);
  }
};

const router = {
  'sample': handlers.sample
};