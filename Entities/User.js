const Fields = require("../Fields/");

module.exports = class User {
  constructor(payload){
    this._ = Symbol(this.constructor.name);
    this[this._] = {
      username: new Fields.TextField(),
      password: new Fields.HashField(),
      firstName: new Fields.TextField(),
      lastName: new Fields.TextField(),
      tos: new Fields.BoolField()
    };

    this.username = payload.username;
    this.password = payload.password;
    this.firstName = payload.firstName;
    this.lastName = payload.lastName;
    this.tos = (typeof payload.tos !== "undefined") ? payload.tos : false;
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
};