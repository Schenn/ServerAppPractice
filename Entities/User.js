const Fields = require("../Fields/");
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

  set username(username){
    this[this._].username.value = username;
  }

  set password(password){
    this[this._].password.value = password;
  }

  set firstName(firstName){
    this[this._].firstName.value = firstName;
  }

  set lastName(lastName){
    this[this._].lastName.value = lastName;
  }

  set tos(tos){
    this[this._].tos.value = tos;
  }

  get data(){
    return {
      username: this.getField("username").value,
      password: this.getField("password").value,
      firstName: this.getField("firstName").value,
      lastName: this.getField("lastName").value,
      tos: this.getField("tos").value
    };
  }

  isValid(){
    return this.getField("username").isValid() &&
        this.getField("password").isValid() &&
        this.getField("firstName").isValid() &&
        this.getField("lastName").isValid() &&
        this.getField("tos").isValid();
  }
};