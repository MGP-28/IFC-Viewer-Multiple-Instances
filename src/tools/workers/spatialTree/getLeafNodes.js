let modelIdx = -1;

onmessage = (e) => {
  const models = e.data;
  const leafNodes = [];

  models.forEach((model, idx) => {
    console.log(model.tree);
    modelIdx = idx;
    const treeLeafNodes = findLeafNode(model, model.tree);
    leafNodes.push(...treeLeafNodes);
  });

  postMessage(leafNodes);
};

/**
 * Finds leaf nodes recursively
 * @param {*} node tree node
 * @returns leaf node
 */
function findLeafNode(node) {
  // If it's a leaf node, returns its data
  if (node.children.length == 0) {
    const leafNode = {
      expressId: node.expressID,
      modelIdx,
      category: node.type,
    };

    return [leafNode];
  }

  // Otherwise, process children recursively
  const foundNodes = [];

  for (let index = 0; index < node.children.length; index++) {
    const childNode = node.children[index];
    const childLeafNodes = findLeafNode(childNode);
    foundNodes.push(...childLeafNodes);
  }

  // if it's a level, set the level property of all child leaf nodes as its own expressID
  if (node.type == "IFCBUILDINGSTOREY") {
    console.log("level", node);
    foundNodes.forEach((leafNode) => {
      leafNode.levelId = node.expressID;
    });
  }

  return foundNodes;
}

self.addEventListener("unhandledrejection", function (event) {
  // the event object has two special properties:
  // event.promise - the promise that generated the error
  // event.reason  - the unhandled error object
  throw event.reason;
});
