const path = require("path");
const RouterCache = require("./lib/RouterCache.js");
const Writer = require('./lib/Writer.js');

let writer = new Writer();
writer.basePath = ".cache";
writer.dir = "/routes/";

let cache = new RouterCache();
cache.buildCacheAsync(path.join(process.cwd(),"controllers"), (routes)=>{
  writer.delete('routecache.json', (err)=>{
    if(err){
      console.log(err);
    }
  });
  writer.create('routecache.json', routes, (err)=>{
    if(err){
      console.log(err);
    }
  });
});

