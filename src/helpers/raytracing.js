import RaycastIntersectObject from "../models/raycastIntersectObject.js";
import * as Models from "../stores/models.js";
import * as RaycastStore from "../stores/raycast.js";
import * as Scene from "../stores/scene.js";
import * as SelectedStore from "../stores/selection.js";

/**
 * Gets users' mouse position, casts a ray to intercept objects on the render and returns their properties
 * @param {Event} event event triggered
 * @param {Boolean} isSelection is user selection or hover highlighting
 */
async function pick(event, isSelection) {
  setupCast(event);

  // Casts a ray for each model uploaded, returns object
  const found = await castEachModel();

  if (!found) {
    RaycastStore.resetFound();

    if (isSelection) {
      SelectedStore.resetSelectedProperties();
    } else {
      SelectedStore.resetHighlightedProperties();
    }
    return;
  }

  RaycastStore.setFound(found);
  const response = await storeFoundObjectProperties(isSelection);
  return response;
}

function setupCast(event) {
  // Computes the position of the mouse on the screen
  const bounds = Scene.threeCanvas.getBoundingClientRect();

  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  RaycastStore.mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  RaycastStore.mouse.y = -(y1 / y2) * 2 + 1;

  // Places it on the camera pointing to the mouse
  RaycastStore.raycaster.setFromCamera(RaycastStore.mouse, Scene.camera);
}

async function castEachModel() {
  const results = [];

  // Get intercepted object closest to the user camera/mouse, if there is one
  // RaycastIntersectObject is used to tie the object to its model loader
  for (let idx = 0; idx < Models.models.length; idx++) {
    const arr = [RaycastStore.subsetRaycast[idx]];
    const result = RaycastStore.raycaster.intersectObjects(arr)[0];
    const intersectiongObj = new RaycastIntersectObject(result, idx);
    if (result) results.push(intersectiongObj);
  }

  if (results.length > 0) {
    const found = getRaycastingResult(results);
    return found;
  } else return false;
}

/**
 * Gets object closest to the camera from all the results obtained
 * @param {Array} results Results from raycasting process
 */
function getRaycastingResult(results) {
  const minDistance = Math.min(...results.map((x) => x.object.distance));
  const found = results.find((x) => x.object.distance == minDistance);
  return found;
}

async function storeFoundObjectProperties(isSelection) {
  const index = RaycastStore.found.object.faceIndex;
  const geometry = RaycastStore.found.object.object.geometry;

  const modelIdx = RaycastStore.found.idx;
  const ifcLoader = Models.models[modelIdx].loader;
  const id = ifcLoader.ifcManager.getExpressId(geometry, index);
  const props = await ifcLoader.ifcManager.getItemProperties(0, id);
  if (isSelection) SelectedStore.setSelectedProperties(props, modelIdx, true);
  else SelectedStore.setHighlightedProperties("fake props", [props.expressID], modelIdx, true);

  return true;
}

export { pick, setupCast as cast, castEachModel };
