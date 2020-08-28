const DBX = require("DB/DBX");
const Collector = require("@schennco/nodeannotations/Collector");

class EntityManager extends Collector{
  static #entityMaps = new Map();
  static #dbx = new DBX();

  #entityPath = '';
  #componentPath = '';



}

module.exports = EntityManager.emitEntity;