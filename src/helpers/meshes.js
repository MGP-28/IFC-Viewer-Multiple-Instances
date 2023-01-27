import * as THREE from "three";
import * as ModelStore from "../stores/models";

function getModelsCenterPoint() {
  const meshes = getAllMeshes();
  if (meshes.length == 0) return;

  const center = getMeshesCenterPoint(meshes);

  return center;
}

function getMeshesCenterPoint(meshes) {
  const boundingBox = getBoundingBox(meshes);
  const boxCenter = new THREE.Vector3();
  boundingBox.getCenter(boxCenter);
  return boxCenter;
}

function getBoxCenterPoint(boundingBox) {
  const boxCenter = new THREE.Vector3();
  boundingBox.getCenter(boxCenter);
  return boxCenter;
}

function getAllMeshes() {
  return ModelStore.models.map((model) => model.model);
}

/**
 * Renders a bounding box for each model and calculates a container box that fits all bounding boxes inside.
 *
 * This container is the starting point to render the planes
 */
function getBoundingBox(meshes) {
  if (meshes.length == 0) return;
  // cycles each model's min and max vectors and computes the lowest values for minVector and the highest values for maxVector
  const minVector = new THREE.Vector3();
  const maxVector = new THREE.Vector3();
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

export { getAllMeshes, getMeshesCenterPoint, getBoundingBox, getBoxCenterPoint, getModelsCenterPoint };
