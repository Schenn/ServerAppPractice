const path = require("path");
const RouteCollector = require("./Collectors/RouteCollector.js");
const Writer = require('./lib/Writer.js');
const onDone = (err)=>{
  if(err){
    console.log(err);
  }
};

let writer = new Writer();
writer.basePath = ".cache";
writer.dir = "/routes/";

let cache = new RouteCollector();
cache.buildCache(path.join(process.cwd(),"Controllers"), (routes)=>{
  writer.delete('routecache.json', onDone);
  writer.create('routecache.json', routes, onDone);
});

