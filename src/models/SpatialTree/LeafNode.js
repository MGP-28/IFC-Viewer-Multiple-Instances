export default class LeafNode {
  constructor(leafNode) {
    this.expressId = leafNode.expressId;
    this.modelIdx = leafNode.modelIdx;
    this.category = leafNode.category;
    this.levelId = leafNode.levelId;
    
    // subject to change
    this.props = undefined;
    this.discipline = undefined;
    this.system = undefined;
  }
}
