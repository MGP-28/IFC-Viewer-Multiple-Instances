import RaycastIntersectObject from "../models/raycastIntersectObject.js";
import * as Models from "../stores/models.js";
import * as RaycastStore from "../stores/raycast.js";
import * as Stored from "../stores/scene.js";

async function pick(event) {
  cast(event);

  // console.log('found', RaycastFoundStored.found);
  let props = null;
  if (RaycastStore.isFoundValid()) {
    const index = RaycastStore.found.object.faceIndex;
    const geometry = RaycastStore.found.object.object.geometry;

    const ifcLoader = Models.ifcLoaders[RaycastStore.found.idx];
    const id = ifcLoader.ifcManager.getExpressId(geometry, index);
    const propsRaw = await ifcLoader.ifcManager.getItemProperties(0, id);
    props = JSON.stringify(propsRaw, null, 2)
  }
  Models.setSelectedProperties(props);
}

function cast(event) {
  // Computes the position of the mouse on the screen
  const bounds = Stored.threeCanvas.getBoundingClientRect();

  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  RaycastStore.mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  RaycastStore.mouse.y = -(y1 / y2) * 2 + 1;

  // Places it on the camera pointing to the mouse
  RaycastStore.raycaster.setFromCamera(RaycastStore.mouse, Stored.camera);

  // Casts a ray
  castEachModel();
}

async function castEachModel() {
  const results = [];

  for (let idx = 0; idx < Models.ifcModels.length; idx++) {
    const arr = [Models.ifcModels[idx]];
    const result = RaycastStore.raycaster.intersectObjects(arr)[0];
    const intersectiongObj = new RaycastIntersectObject(result, idx);
    if (result) results.push(intersectiongObj);
  }

  // console.log(results)

  if (results.length > 0) getRaycastingResult(results);
  else RaycastStore.resetFound();
}

function getRaycastingResult(results) {
  const minDistance = Math.min(...results.map((x) => x.object.distance));
  const found = results.find((x) => x.object.distance == minDistance);
  RaycastStore.setFound(found);
}

export { pick, cast, castEachModel };
