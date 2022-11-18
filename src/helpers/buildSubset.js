import materials from "../configs/materials.js";
import * as Scene from "../stores/scene.js";

/**
 * 
 * @param {Object} model model instance of the loaded IFC
 * @param {array} ids array with all the expressIDs of the object to add to the subset
 * @param {string} type name of type of material to be used (see configs/materials.js)
 */
function createSubset(model, ids, type) {
  //create subset for provided model
  const material = materials[type];
  model.loader.ifcManager.createSubset({
    modelID: 0,
    ids: ids,
    material: material,
    scene: Scene.scene,
    removePrevious: true,
  });
}

function removeSubset(model, type) {

  // model from store, type is string (selected, highlighted, ...)
  // const material = materials[type];
  // model.loader.ifcManager.removeSubset(0, Scene.scene, material);

  createSubset(model, [], type)
}

export { createSubset, removeSubset };
