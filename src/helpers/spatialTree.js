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
  let types = [];
  const newChildren = [];
  const expressID = 0;

  for (item in childrenObj) {
    types.push(childrenObj[item].type);
    types = [...new Set(types)];
  }

  for (let i = 0; i < types.length; i++) {
    const array = [];

    for (let j = 0; j < childrenObj.length; j++) {
      if (childrenObj[j].type === types[i]) {
        array.push(childrenObj[j]);
      }
    }
    const type = types[i];
    newChildren.push({ children: array, expressID: expressID, type: type });
    level.children = newChildren;
    if (![...Models.usedCategories].includes(types[i])) {
      Models.addCategories([types[i]]);
    }
  }
}

export { getAllSpacialTrees, getSpacialTree };
