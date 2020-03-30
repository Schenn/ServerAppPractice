const User = require("../Entities/User");
const Form = require("./Form");
const TextField = require("./Validation/TextField");
const HashField = require("./Validation/HashField");
const BoolField = require("./Validation/BoolField");

const emailField = ()=>{
  let email = new TextField();
  email.pattern = /[^@]+@+[^.]+.+[\w\d]/;
  email.name = "email";
  email.label = "Email";
  return email;
};

const nameField = ()=>{
  let name = new TextField();
  name.name = 'userName';
  name.label = "Username";
  name.minLength = 5;
  name.maxLength = 16;
  return name;
};

const passwordField = ()=>{
  let password = new HashField();
  password.withSecret("UserSecret");
  password.minLength = 8;
  password.maxLength = 24;
  password.label = "Password";
  return password;
};

const tosField = ()=>{
  let tos = new BoolField();
  tos.requireTrue();
  tos.label = "I agree not to do mean things to the website.";
  return tos;
};

module.exports = class NewUser extends Form {
  constructor(payload){
    super(payload);

    this.addField("userName", [nameField()])
      .addField("email", [emailField()])
      .addField("password", [passwordField()])
      .addField("tos", [tosField()])
    ;
  }

  get Model(){
    return new User(this.payload);
  }

  template(){
    return (`
      <form action="/u/create" method="post" id="newuserform">
        <fieldset name="newuserform">
            ${this.getField("userName").html}
            ${this.getField("email").html}
            <label for="password">Password</label>
            <input name="password" id="password" type="password" />
            <label for="tos">TOS</label>
            <input type="checkbox" name="tos" id="tos" />
        </fieldset>
        <input type="submit">
      </form>
      <script>
        document.querySelector('#newuserform').addEventListener('submit', ${this.formHandler()});
      </script>
    `);
  }
};