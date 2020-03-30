const Autoloader = require("../Server/Autoloader");

const _ = Symbol("FormManager");
module.exports = class FormManager{

  constructor() {
    this[_] = {
    };
  }

  beforeRoute(req, res, route){
    if(route.hasAnnotation("form")){
      let formName = route.getAnnotation("form");
      // Load the form class
      let form = Autoloader(formName);
      console.log(req);
      console.log(res);
      let instance = new form(req.payload);
      if(req.httpMethod !== req.METHODS.get){
        // Otherwise, pass the request data to the form class for validation

      }
      // add the the form to the request
      req.addForm(instance);
    }
  }

};