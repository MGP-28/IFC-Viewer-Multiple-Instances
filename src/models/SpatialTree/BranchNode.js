export default class BranchNode {
    constructor(branchNode) {
      this.title = branchNode.title;
      this.children = [...branchNode.children];
    }
  }
  