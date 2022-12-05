const clippingPlanes = [];
const visualPlanes = [];

function addClippingPlane(plane, visualPlane) {
  clippingPlanes.push(plane);
  visualPlanes.push(visualPlane);
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
}
function resetFoundPlane(){
  foundPlane = undefined;
}

export {
  clippingPlanes,
  visualPlanes,
  addClippingPlane,
  resetClippingPlanes,
  foundPlane,
  setFoundPlane,
  resetFoundPlane
};
