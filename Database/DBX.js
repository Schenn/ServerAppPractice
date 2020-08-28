const mysqlx = require('@mysql/xdevapi');
const propDefaultLengths = {
  'bit':1,
  'tinyint':4,
  'smallint':6,
  'mediumint':9,
  'int':11,
  'bigint':20,
  'decimal':'(10,0)',
  'boolean': {'tinyint':1},
  'year':4,
  'char':1,
  'varchar':255,
  'binary':8,
  'varbinary':16,
  'tinyblob':255,
  'tinytext':255,
};

const multiHostDns = function(strings, hosts){
    let defaultPort = hosts[0].port;
    let hostEntry = function(host){
      return `(address=${host.name}:${host.port ? host.port : defaultPort}${host.priority > 0 ? `, priority=${host.priority}` : ''})`
    }
    return `[${hostStrings.map(hostEntry).join(', ')}]`;
}

const createTableSql = function(strings, tableName, columns){
  let fields = Object.keys(columns);
  let pKey = fields[0];
  let columnSql = function(_, name, {type, dataLength, defaultValue, notNull, noai, update}){
    type = type ? type : name === pKey ? 'int': null;
    dataLength = dataLength || propDefaultLengths[type];
    defaultValue = defaultValue || type === "timestamp" ? "CURRENT_TIMESTAMP" : '';

    return `${name} ${type.toUpperCase()}(${dataLength})${notNull ?
      ` NOT NULL`: ''}${pKey === name && !noai ? ` AUTO_INCREMENT` : ''}${name === pKey ?
      ` PRIMARY KEY` : ``}${pKey !== name && defaultValue ? ` DEFAULT=${defaultValue}` :
      ''}${type === 'timestamp' && update ? 'ON UPDATE CURRENT_TIMESTAMP' : ''}`;
  }

  return `CREATE TABLE ${tableName} (${fields.map((name)=>{
      let colData = columns[name];
      return columnSql`${name}${colData}`;
  }).join(', ')});`;

}

class DBX {
  static #hosts = [];
  static #user = '';
  static #password = '';
  static #connAtts = null;

  /**
   * @type {Session}
   */
  #connection = null;
  #poolClient = null;
  #activeTransaction = false;
  /**
   *
   * @type {Schema | null}
   */
  #schema = null;

  #tryCount = 0;
  #tryMax = 3;
  #tryOut;

  static addHost(host, port, priority = -1){
    DBX.#hosts.push({name:host, port: port, priority: priority});
  }

  static setUser(username, password){
    DBX.#user = username;
    DBX.#password = password;
  }

  static setConnectionAttribute(name, attribute){
    if(DBX.#connAtts === null){
      DBX.#connAtts = {};
    }
    DBX.#connAtts[name] = attribute;
  }

  static setPooling(idle, size, timeout){
    DBX.setConnectionAttribute('pooling', {enabled: true, maxIdleTime: idle, maxSize: size, queueTimeout: timeout});
  }

  static get pools(){
    return DBX.#connAtts && DBX.#connAtts.pooling;
  }

  static dnsString(dbName){
    return `mysqlx://${DBX.#user}:${DBX.#password}@${DBX.#hosts.length > 1 ?
      multiHostDns`${DBX.#hosts}${dbName ? `/${dbName}` : ''}` :
      `${DBX.#hosts[0].name}:${DBX.#hosts[0].port}`}${dbName ? `/${dbName}` : ''}`;

  }

  set currentDB(name){
    this.#schema = this.#connection.getSchema(name);
  }


  get schemas(){
    return this.#connection.getSchemas();
  }

  get connection(){
    return this.#connection;
  }


  /**
   *
   * @param dbName Pass nothing to get the default schema
   * @return {Schema}
   */
  getDB(dbName){
    return this.#connection.getSchema(dbName);
  }


  /**
   *
   * @param dbName
   * @todo Test and flesh out pooling
   * @return {Promise<DBX>}
   */
  connect(dbName = ''){
    let dns = DBX.dnsString(dbName);
    return new Promise((resolve, reject)=>{
      const usePool = ()=>{
        this.#poolClient = mysqlx.getClient(dns, DBX.#connAtts);
        this.#poolClient.getSession.then(session => {
          this.#connection = session;
          if(dbName){
            this.currentDB = dbName;
          }
          resolve(this);
        }).catch(reject);
      };

      const tryAgain = (err)=>{
        if(++this.#tryCount < this.#tryMax){
          console.log(`Failed to connect to DB. Trying again in 20 seconds. ${err.message}`);
          this.#tryOut = setTimeout(checkDb, 20000);
        } else {
          throw new Error("Unable to connect to DB.");
        }
      };
      const checkDb = ()=>{
        mysqlx.getSession(dns)
          .then(session => {
            this.#tryCount = this.#tryMax;
            clearTimeout(this.#tryOut);
            this.#connection = session;
            if(dbName){
              this.currentDB = dbName;
            }
            resolve (this);
          }).catch(tryAgain);
      };
      // If we're pooling, we need to use the pool client.
      if(DBX.pools){
        usePool();
      } else {
        checkDb();
      }

      // After all the then's are processed, close the pool client.
    }).finally(()=>{if(this.#poolClient){this.#poolClient.close()}});

  }

  tableExists(tableName){
    return !!this.#schema.getTable(tableName);
  }

  startTransaction(){
    this.#activeTransaction = true;
    return this.#connection.startTransaction();
  }

  inTransaction(){
    return this.#activeTransaction;
  }

  rollback(){
    this.#activeTransaction = false;
    return this.#connection.rollback();
  }

  commit(){
    this.#activeTransaction = false;
    return this.#connection.commit();
  }

  lastInsertId(){

  }

  createDatabase(database){
    return new Promise((resolve, reject) => {
      this.#connection.createSchema(database).then(()=>{
        resolve(this);
      }).catch(err => {reject(err);});
    });
  }

  dropDatabase(db){
    return new Promise((resolve, reject)=>{
      this.#connection.dropSchema(database).then(()=>{
        resolve(this);
      }).catch(err => reject(err));
    });
  }


  /**
   * Relational methods
   */
  /**
   * Create a table
   */
  createTable(tableName, props){
    let createSql = createTableSql`${tableName}${props}`;
    return new Promise((resolve, reject)=>{
      this.startTransaction();
      this.dropTable(tableName).then(()=>{
        this.#connection.sql(createSql).execute().then(()=>{
          resolve(this);
        }).catch(reject);
      })
    }).finally(()=>{
      this.commit();
    }).catch((e)=>{
      console.log(e);
      this.rollback()
    });
  }

  /**
   * Drop a table if it exists
   * @param tableName
   * @return {Promise<DBX>}
   */
  dropTable(tableName){
    return new Promise((resolve, reject)=>{
      this.#connection.sql(`DROP TABLE IF EXISTS ${tableName}`).execute().then(()=>{resolve(this)}).catch(reject);
    });

  }
}

module.exports = DBX;