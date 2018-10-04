const RouterCache = require("./lib/RouterCache.js");

let cache = new RouterCache(".cache");

cache.buildCacheAsync("controllers");