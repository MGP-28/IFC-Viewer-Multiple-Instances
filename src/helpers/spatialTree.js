import * as Models from "../stores/models";

let modelInstanceIdx = undefined;

async function getAllSpatialTrees() {
  for (let idx = 0; idx < Models.models.length; idx++) {
    modelInstanceIdx = idx;
    const newTree = await getSpatialTree(idx);
    Models.models[idx].tree = newTree;
  }
  return true;
}

async function getSpatialTree(idx) {
  const ifcLoader = Models.models[idx].loader;
  const ifcModelTree = await ifcLoader.ifcManager.getSpatialStructure(0);
  //await arranjeNodesInTree(ifcModelTree);
  return ifcModelTree;
}

export { getAllSpatialTrees, getSpatialTree };
