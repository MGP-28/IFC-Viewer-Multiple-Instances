import materials from "../configs/materials.js";
import { models } from "../stores/models.js";
import * as Scene from "../stores/scene.js";
import Model from "../models/Model.js";

/**
 *  Creates subset with custom material, used for highlighting
 * @param {Model} model model instance of the loaded IFC
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

/**
 * Removes previously craeted subset. Identifies subset by its custom material
 * @param {Model} model model instance of the loaded IFC
 * @param {String} type name of type of material to be used (see configs/materials.js)
 */
function removeSubset(model, type) {
  createSubset(model, [], type);
}

/**
 * Creates subset for a specific model. UNUSED
 * @param {Model} model 
 * @param {Integer} expressID 
 * @returns subset
 */
function createObjectSubset(model, expressID) {
  const arr = [];
  arr.push(expressID);
  const subset = model.loader.ifcManager.createSubset({
    modelID: 0,
    ids: arr,
    scene: Scene.scene,
    removePrevious: true,
    customID: expressID,
  });
  return subset;
}

/**
 * Add object to subset by its expressID
 * @param {Integer} modelIdx Identifies which model to manipulate
 * @param {Integer} expressID 
 */
function addToSubset(modelIdx, expressID) {
  const loader = models[modelIdx].loader;
  loader.ifcManager.createSubset({
    modelID: 0,
    ids: [expressID],
    scene: Scene.scene,
    removePrevious: false,
    customID: modelIdx,
  });
}

/**
 * Removes object to subset by its expressID
 * @param {Integer} modelIdx Identifies which model to manipulate
 * @param {Integer} expressID 
 */
function removeFromSubset(modelIdx, expressID) {
  const loader = models[modelIdx].loader;
  loader.ifcManager.removeFromSubset(0, [expressID], modelIdx);
}

export {
  createSubset,
  removeSubset,
  createObjectSubset,
  addToSubset,
  removeFromSubset,
};
