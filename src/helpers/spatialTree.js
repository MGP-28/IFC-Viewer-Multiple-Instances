import * as Models from "../stores/models";

async function getAllSpacialTrees() {
  for (let idx = 0; idx < Models.models.length; idx++) {
    const newTree = await getSpacialTree(idx);
    Models.models[idx].tree = newTree;
  }
  return true;
}

async function getSpacialTree(idx) {
  const ifcLoader = Models.models[idx].loader;
  const ifcModelTree = await ifcLoader.ifcManager.getSpatialStructure(0);
  console.log("tree", ifcModelTree);
  arranjeNodesInTree(ifcModelTree);
  return ifcModelTree;
}

let count = 0;
function arranjeNodesInTree(obj) {
  for (const i in obj) {
    if (typeof obj[i] == "object" && obj[i] !== null) {
      arranjeNodesInTree(obj[i]);
    } else {
      const type = obj.type;
      if (type === "IFCBUILDINGSTOREY" && count % 2 == 0) {
        groupNodes(obj);
      }
    }
    count += 1;
  }
}

function groupNodes(level) {
  const childrenObj = level.children;
  class Child {
    constructor(type) {
      this.children = [];
      this.expressID = expressID;
      this.type = type;
    }
  }
  const newChildren = [];
  // ExpressID to give to Grouping nodes
  const expressID = 0;

  for (let idx = 0; idx < childrenObj.length; idx++) {
    let item = childrenObj[idx];

    if (hasChildren(item)) {
      console.log("has children");
      const nestedChildren = resolveNestedChildren(item);
      nestedChildren.forEach(nestedChild => {
        childrenObj.push(nestedChild);
      });
      item.children = [];
    }

    const type = item.type;
    let typeInstance = newChildren.find((x) => x.type == type);
    if (!typeInstance) {
      typeInstance = new Child(type);
      newChildren.push(typeInstance);
    }
    typeInstance.children.push(item);
  }

  level.children = Array.of(...newChildren);
}

function resolveNestedChildren(item) {
  let leafNodes = [];

  if (!item.children) return item;

  const children = item.children;

  for (let idx = 0; idx < children.length; idx++) {
    const item = children[idx];
    if (hasChildren(item)) {
      const nestedChildren = resolveNestedChildren(item);
      leafNodes = leafNodes.concat(nestedChildren);
    } else leafNodes.push(item);
  }

  return leafNodes;
}

function hasChildren(node) {
  return (
    node.children !== null &&
    node.children !== undefined &&
    node.children.length > 0
  )
}

export { getAllSpacialTrees, getSpacialTree };
