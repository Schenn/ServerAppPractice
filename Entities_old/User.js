const Fields = require("../Validation/");
const Entity = require("./Entity");

module.exports = class User extends Entity {
  constructor(){
    super();
    let fields = {
      username: new Fields.TextField(),
      password: new Fields.HashField(),
      firstName: new Fields.TextField(),
      lastName: new Fields.TextField(),
      tos: new Fields.BoolField()
    };
    fields.tos.requireTrue();
    this.initFields(fields);
  }

  get username(){
    return this.getField("username").value;
  }

  set username(username){
    this.getField("username").value = username;
  }

  get password(){
    return this.getField("password").value;
  }

  set password(password){
    this.getField("password").value = password;
  }

  get firstName(){
    return this.getField("firstName").value;
  }

  set firstName(firstName){
    this.getField("firstName").value = firstName;
  }

  get lastName(){
    return this.getField("lastName").value;
  }

  set lastName(lastName){
    this.getField("lastName").value = lastName;
  }

  get tos(){
    return this.getField("tos").value;
  }

  set tos(tos){
    this.getField("tos").value = tos;
  }
};