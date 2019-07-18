const User = require("../Entities/User");
const Form = require("../Server/Form");
const TextField = require("./Validation/TextField");
const HashField = require("./Validation/HashField");
const BoolField = require("./Validation/BoolField");

module.exports = class NewUser extends Form {
  constructor(payload){
    super(payload);
    this.addField("firstName", [new TextField()])
      .addField("lastName", [new TextField()])
      .addField("phone", [new TextField()])
      .addField("password", [new HashField().withSecret("UserSecret")])
      .addField("tos", [new BoolField().requireTrue()])
  }

  getEntity(){
    let user = new User();
    user.firstName = this.getField("firstName");
    user.lastName = this.getField("lastName");
    user.phone = this.getField("phone");
    user.password = this.getField("password");
    return user;
  }

};