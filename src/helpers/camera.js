import { savedViews } from "../stores/savedViews";
import * as StoreScene from "../stores/scene";

function getCameraData() {
  const camera = StoreScene.camera;

  const vRotation = new THREE.Vector3();
  camera.getWorldDirection(vRotation);

  camera.updateMatrixWorld();
  const vPosition = camera.position.clone();
  vPosition.applyMatrix(camera.matrixWorld);

  return {
    position: vPosition,
    rotation: vRotation
  }
}

function setCameraData(id){
  const camera = StoreScene.camera;
  const savedView = savedViews[id];

  // set values

}

export { getCameraData, setCameraData }