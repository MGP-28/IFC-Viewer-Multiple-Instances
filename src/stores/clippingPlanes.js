const clippingPlanes = [];
const visualPlanes = [];
const normals = [];
let selectedPlaneIdx = undefined;

function addClippingPlane(visualPlane, plane, vNormal) {
  visualPlanes.push(visualPlane);
  clippingPlanes.push(plane);
  normals.push(vNormal);
}

function resetClippingPlanes() {
  while (clippingPlanes.length > 0) {
    clippingPlanes.pop();
    visualPlanes.pop();
  }
}

let foundPlane = undefined;
function setFoundPlane(newPlane) {
  foundPlane = newPlane;
  selectedPlaneIdx = visualPlanes.map(x => x.uuid).indexOf(foundPlane.object.uuid);
}
function resetFoundPlane() {
  foundPlane = undefined;
  selectedPlaneIdx = undefined;
}

const dragPositions = {
  initial: {
    x: undefined,
    y: undefined,
  },
  final: {
    x: undefined,
    y: undefined,
  },
};

function resetDragPositions() {
  dragPositions.initial.x = undefined;
  dragPositions.initial.y = undefined;
  dragPositions.final.x = undefined;
  dragPositions.final.y = undefined;
}

function setDragPositions(
  iX = undefined,
  iY = undefined,
  fX = undefined,
  fY = undefined
) {
  if (iX) dragPositions.initial.x = iX;
  if (iY) dragPositions.initial.y = iY;
  if (iX) dragPositions.final.x = fX;
  if (fY) dragPositions.final.y = fY;
}

function setDragInitialPositions(iX = undefined, iY = undefined) {
  if (iX) dragPositions.initial.x = iX;
  if (iY) dragPositions.initial.y = iY;
}

function setDragFinalPositions(fX = undefined, fY = undefined) {
  if (fX) dragPositions.final.x = fX;
  if (fY) dragPositions.final.y = fY;
}

export {
  clippingPlanes,
  visualPlanes,
  normals,
  addClippingPlane,
  resetClippingPlanes,
  foundPlane,
  selectedPlaneIdx,
  setFoundPlane,
  resetFoundPlane,
  dragPositions,
  resetDragPositions,
  setDragPositions,
  setDragInitialPositions,
  setDragFinalPositions,
};
