const User = require("../Models/User");
const Form = require("./Form");
const Fields = require("./Fields");

const emailField = ()=>{
  let email = new Fields.TextField("email", "Email");
  email.required = true;
  email.initOptions({pattern: {pattern: /[^@]+@+[^.]+.+[\w\d]/}});
  return email;
};

const nameField = ()=>{
  let name = new Fields.TextField("userName", "Username");
  name.required = true;
  name.initOptions({length: {min: 5, max: 16}});
  return name;
};

const passwordField = ()=>{
  let password = new Fields.PassField("password", "Password");
  password.required = true;
  password.initOptions({length:{min: 8,max: 24}});
  password.withSecret("UserSecret");
  return password;
};

const tosField = ()=>{
  let tos = new Fields.BoolField("tos", "I agree not to do mean things to the website.");
  tos.required = true;
  return tos;
};

module.exports = class NewUser extends Form {
  action = "/u/createTable";
  method = "post";
  name = "newuserform";

  constructor(data){
    super(data);
    this.addField("userName", nameField())
      .addField("email", emailField())
      .addField("password", passwordField())
      .addField("tos", tosField())
    ;
  }

  get Model(){
    return new User(this.payload);
  }

};