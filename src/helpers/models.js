import * as THREE from "three";
import { boundingBox, models } from "../stores/models";

/**
 * Renders a bounding box for each model and calculates a container box that fits all bounding boxes inside.
 *
 * This container is the starting point to render the planes
 */
function getCombinedBoundingBox() {
  // cycles each model's min and max vectors and computes the lowest values for minVector and the highest values for maxVector
  const minVector = new THREE.Vector3();
  const maxVector = new THREE.Vector3();

  const meshes = getMeshes();

  for (let idx = 0; idx < meshes.length; idx++) {
    const mesh = meshes[idx];
    const boundingBox = new THREE.BoxHelper(mesh, 0xff0000);
    const box = new THREE.Box3();
    box.setFromObject(boundingBox);
    // if first model, just copies values
    if (idx == 0) {
      minVector.copy(box.min);
      maxVector.copy(box.max);
      continue;
    }
    // if not, calculates which axle value needs to be replaced
    for (const key in minVector) {
      if (minVector[key] > box.min[key]) minVector[key] = box.min[key];
    }
    for (const key in maxVector) {
      if (maxVector[key] < box.max[key]) maxVector[key] = box.max[key];
    }
  }

  const box3 = new THREE.Box3(minVector, maxVector);

  return box3;

  //#region render box in scene - comment return for it
  const size = {
    x: box3.max.x - box3.min.x + 2,
    y: box3.max.y - box3.min.y + 2,
    z: box3.max.z - box3.min.z + 2,
  };
  const center = new Vector3();
  box3.getCenter(center);

  const boundingGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  const boundingMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    opacity: 0.2,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const boundingMesh = new THREE.Mesh(boundingGeometry, boundingMaterial);
  boundingMesh.position.copy(center);

  SceneStore.scene.add(boundingBox); // test~

  return box3;
  //#endregion render box in scene - comment return for it
}

function getMeshes() {
  const meshes = [];
  for (let idx = 0; idx < models.length; idx++) {
    const modelInstance = models[idx];
    meshes.push(modelInstance.model);
  }
  return meshes;
}

function getModelsMiddlePoint(){
  const containingBox = boundingBox;
  const center = new THREE.Vector3();
  containingBox.getCenter(center);
  return center;
}

export { getCombinedBoundingBox, getMeshes, getModelsMiddlePoint };
