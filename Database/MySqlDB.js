import Database from "Database.js";

module.exports = class MySqlDB extends Database{

  constructor(connectionArgs){
    super(connectionArgs);
    this.connect();
  }

  connect(){
    
  }

  disconnect(){

  }

  query(query = "SELECT 1;"){

  }
};