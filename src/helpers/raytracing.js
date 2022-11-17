import RaycastIntersectObject from "../models/raycastIntersectObject.js";
import * as Models from "../stores/models.js";
import * as RaycastStore from "../stores/raycast.js";
import * as Scene from "../stores/scene.js";
import * as SelectedStore from "../stores/selection.js";

/**
 * Gets users' mouse position, casts a ray to intercept objects on the render and returns their properties
 * @param {Event} event event triggered
 * @param {boolean} isSelected is user selection or just hover. This dictates logic for renderization
 */
async function pick(event, isSelected) {
  cast(event);

  let props = null;
  if (RaycastStore.isFoundValid()) {
    const index = RaycastStore.found.object.faceIndex;
    const geometry = RaycastStore.found.object.object.geometry;

    const ifcLoader = Models.models[RaycastStore.found.idx].loader;
    const id = ifcLoader.ifcManager.getExpressId(geometry, index);
    props = await ifcLoader.ifcManager.getItemProperties(0, id);
  }
  SelectedStore.setSelectedProperties(props, isSelected);
}

function cast(event) {
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

  // Casts a ray for each model uploaded, returns object
  castEachModel();
}

async function castEachModel() {
  const results = [];

  // Get intercepted object closest to the user camera/mouse, if there is one
  // RaycastIntersectObject is used to tie the object to its model loader
  for (let idx = 0; idx < Models.models.length; idx++) {
    const arr = [Models.models[idx].model];
    const result = RaycastStore.raycaster.intersectObjects(arr)[0];
    const intersectiongObj = new RaycastIntersectObject(result, idx);
    if (result) results.push(intersectiongObj);
  }

  if (results.length > 0) getRaycastingResult(results);
  else RaycastStore.resetFound();
}

/**
 * Gets object closest to the camera from all the results obtained
 * @param {Array} results Results from raycasting process
 */
function getRaycastingResult(results) {
  const minDistance = Math.min(...results.map((x) => x.object.distance));
  const found = results.find((x) => x.object.distance == minDistance);
  RaycastStore.setFound(found);
}

export { pick, cast, castEachModel };
