onmessage = async (e) => {
  const trees = e.data;
  const leafNodes = [];

  trees.forEach((tree) => {
    const treeLeafNodes = findLeafNode(tree);
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
  if (node.children.length == 0) return [node];

  const foundNodes = [];

  for (let index = 0; index < node.children.length; index++) {
    const childNode = node.children[index];
    const childLeafNodes = findLeafNode(childNode);
    foundNodes.push(...childLeafNodes);
  }

  return foundNodes;
}

self.addEventListener("unhandledrejection", function (event) {
  // the event object has two special properties:
  // event.promise - the promise that generated the error
  // event.reason  - the unhandled error object
  throw event.reason;
});
