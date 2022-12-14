import * as THREE from "three";
import { scene } from "./scene";

const clippingPlanes = [];
const visualPlanes = [];
const normals = [];
let selectedPlaneIdx = undefined;
let wireframe = undefined;

function addWireframe(newWireframe) {
  wireframe = newWireframe;
}

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
  selectedPlaneIdx = visualPlanes
    .map((x) => x.uuid)
    .indexOf(foundPlane.object.uuid);
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

const edgePositions = {
  min: {
    x: undefined,
    y: undefined,
    z: undefined,
  },
  max: {
    x: undefined,
    y: undefined,
    z: undefined,
  },
  currentMin: {
    x: undefined,
    y: undefined,
    z: undefined,
  },
  currentMax: {
    x: undefined,
    y: undefined,
    z: undefined,
  },
};

function setEdgePositions(vMin, vMax) {
  edgePositions.min = new THREE.Vector3(vMin.x, vMin.y, vMin.z);
  edgePositions.currentMin = new THREE.Vector3(vMin.x, vMin.y, vMin.z);
  edgePositions.max = new THREE.Vector3(vMax.x, vMax.y, vMax.z);
  edgePositions.currentMax = new THREE.Vector3(vMax.x, vMax.y, vMax.z);
}

function reset() {
  for (let idx = 0; idx < visualPlanes.length; idx++) {
    const vP = visualPlanes[idx];
    scene.add(vP);
  }
  scene.add(wireframe);
}

function hide() {
  for (let idx = 0; idx < visualPlanes.length; idx++) {
    const vP = visualPlanes[idx];
    vP.removeFromParent();
  }
  wireframe.removeFromParent();
}

const crossPlane = {
  points: {
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
  },
  planes: [],
};

function resetCrossPlane(){
  crossPlane.points.start = new THREE.Vector3();
  crossPlane.points.end = new THREE.Vector3();
  crossPlane.planes = [];
}

export {
  clippingPlanes,
  visualPlanes,
  normals,
  addWireframe,
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
  edgePositions,
  setEdgePositions,
  reset,
  hide,
  crossPlane,
  resetCrossPlane,
};
