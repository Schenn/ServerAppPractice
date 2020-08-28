const path = require("path");

const DBX = require("DB/DBX");
const Collector = require("@schennco/nodeannotations/Collector");

class EntityManager extends Collector{
  static #entityMaps = {
    "Components": new Map(),
    "Entities": new Map(),
    "Collections": new Map()
  };
  static #dbx = new DBX();
  static #rootEntityMetadata;
  static #rootComponentMetadata;
  static #rootCollectionMetadata;

  prepareEntity(metadata, namespace){
    let eType = metadata.classDoc.hasAnnotation("DBX/Component") ? "Components" :
      metadata.classDoc.hasAnnotation("DBX/Entity") ? "Entities" :
      metadata.classDoc.hasAnnotation("DBX/Collection") ? "Collections" : '';

    if(!eType) {
      throw `Missing Entity Type at namespace: ${namespace}`;
    }
    EntityManager.#entityMaps[eType].set(namespace, metadata);
    this.install(etype, metadata, namespace);

  }


  install(etype, metadata, namespace){
    // Does the entity have a table, if not, create one?
    let tableName = metadata.classDoc.hasAnnotation("DBX/Table") ?
      metadata.classDoc().getFirstAnnotationValue("DBX/Table") : metadata.className;

    return new Promise((resolve, reject)=>{
      if(EntityManager.#dbx.tableExists(tableName)){
        resolve();
      } else {
        let cols = [];
        let colProps = [];
        // FOR WORKING THROUGH THE CONCEPT
          // Get the parent class's propertyData as well.


        this.#dbx.createTable(tableName, cols);
        // Create the Entity/Component/Collection table
          // Get the properties from the class

          // If the parent is not Entity/Component/Collection,
            //  than get each parent's dbx properties until you reach E/C/C

        // If its a Collection or entity,
        //let oneToOnejoins = metadata.getAnnotation("DBX/OneToOne");
        //let oneToManyJoins = metadata.getAnnotation("DBX/OneToMany");
          // for each component in the collection/entity
            // create a join table
        // If its a collection
          // for each subEntity in the collection
            // create a join table

      }
    });



    let components = metadata.classDoc().getAnnotation("DBX/Component");
  }


  getComponent(namespace){

  }

  getEntity(namespace){
    let meta = EntityManager.#entityMaps.Entities.get(namespace);

    let instance = meta.getInstance();
    instance.getComponent = (name)=>{

    }
  }

  buildCache(entitiesPath){

    this.filePath = entitiesPath;
    return new Promise((resolve, reject)=>{
      this.on("fileParsed", (metadata)=>{
        if(metadata.classDoc.className === "Entity"){
          EntityManager.#rootEntityMetadata = metadata;
        } else if (metadata.classDoc().className === "Component"){
          EntityManager.#rootComponentMetadata = metadata;
        } else {
          EntityManager.#rootCollectionMetadata = metadata;
        }
      });
      this.collectFromFile(path.join(__dirname, "Entity.js"));
      this.collectFromFile(path.join(__dirname, "Component.js"));
      this.collectFromFile(path.join(__dirname, "Collection.js"), ()=>{
        this.on("fileParsed", this.prepareEntity.bind(this));
        this.collect().then(resolve).catch(reject);
      });

    });
  }



}

module.exports = EntityManager.emitEntity;