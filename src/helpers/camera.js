import { savedViews } from "../stores/savedViews";
import * as StoreScene from "../stores/scene";
import { multipleLogsWithSeperator } from "./generic/logging";
import * as THREE from "three";

function getCameraData() {
  const camera = StoreScene.camera;

  // get rotation
  const vRotation = new THREE.Vector3();
  camera.getWorldDirection(vRotation);

  // get position
  camera.updateMatrixWorld();
  const vPosition = camera.position.clone();
  // vPosition.applyMatrix3(camera.matrixWorld);

  return {
    position: vPosition,
    rotation: vRotation,
  };
}

// function setCameraData(id) {
  function setCameraData(savedView) {
  const camera = StoreScene.camera;
  // const savedView = savedViews[id];

  const middlePoint = {};

  for (const key in savedView.clipping.min) {
    middlePoint[key] = (savedView.clipping.min + savedView.clipping.max) / 2;
  }

  // set values
  camera.position.copy(savedView.camera.position);

  camera.lookAt(middlePoint);
}

export { getCameraData, setCameraData };
