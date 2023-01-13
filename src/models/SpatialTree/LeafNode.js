export default class LeafNode {
  constructor(modelIdx, expressId, category, level) {
    this.expressId = expressId;
    this.modelIdx = modelIdx;
    this.category = category;
    this.level = level;

    // subject to change
    this.discipline = undefined;
    this.system = undefined;
  }
}
