/**
 *
 * @classRoute /
 * @type {MockController}
 */
module.exports = class MockController {

  constructor(){

  }

  get foobar(){

  }

  set foobar(val){

  }

  /**
   * @type {string}
   * @column
   * @test
   */
  get dbProperty(){
    return privateProps.dbProperty;
  }

  /**
   * @type {string}
   * @column
   * @test
   */
  set dbProperty(val){
    privateProps.dbProperty = val;
  }

  /**
   * @type {string}
   * @test
   */
  get readOnlyProperty(){
    return privateProps.readOnlyProperty;
  }

  /**
   * @route /
   * @param data
   * @param cb
   */
  index(data, cb){

  }

  /**
   * @route thing
   * @param data
   * @param cb
   */
  doRouteThing(data, cb){

  }

  /**
   * @route process
   * @method post
   *
   * @param data
   * @param cb
   */
  processPost(data, cb){

  }
};