const phraseRegex = /(\w+)(?:\s*=\s*|\s)?(({\w*})(?:\s))?(\S+)/g;
const nodeRegex = /(\w+)/g;

module.exports = class Annotation {
  constructor(expression){
    this.phrase = expression.match(phraseRegex)[0];
    this.nodes = this.phrase.match(nodeRegex);
  }

  get name(){
    return this.nodes[0];
  }

  get type(){
    return (this.nodes.length === 3) ? this.nodes[1] : null;
  }

  get value(){
    return (this.nodes.length === 3) ? this.nodes[2] : this.nodes[1];
  }
};