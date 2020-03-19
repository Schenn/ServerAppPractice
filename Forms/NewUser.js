const User = require("../Entities/User");
const Form = require("./Form");
const TextField = require("./Validation/TextField");
const HashField = require("./Validation/HashField");
const BoolField = require("./Validation/BoolField");

module.exports = class NewUser extends Form {
  constructor(payload){
    super(payload);
    this.addField("userName", [new TextField()])
      .addField("email", [new TextField()])
      .addField("password", [new HashField().withSecret("UserSecret")])
      .addField("tos", [new BoolField().requireTrue()])
  }

  getModel(){
    let user = new User();
    user.username = this.getField("userName");
    user.email = this.getField("email");
    user.password = this.getField("password");
    return user;
  }

  template(){
    return (`
      <form>
        <fieldset>
            <label for="userName">Username</label>
            <input name="userName" id="userName" type="text" />
            <label for="email">Email</label>
            <input name="email" id="email" type="text" />
            <label for="password">Password</label>
            <input name="password" id="password" type="password" />
        </fieldset>
      </form>
    `);
  }
};