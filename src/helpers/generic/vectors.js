import * as THREE from "three";

function getRotationDiferences(quarterionInitial, quarterionFinal) {
  const quarterionDif = new THREE.Quaternion();

  for (const axle in quarterionDif) {
    const angleDiference = quarterionFinal[axle] - quarterionInitial[axle];
    quarterionDif[axle] = angleDiference;
  }

  return quarterionDif;
}

function getLineVector(point1, point2) {
  const vec = new THREE.Vector3();
  vec.subVectors(point2, point1);
  return vec;
}

function isEqual(v1, v2) {
  for (const axle in v1) {
    if (v1[axle] != v2[axle]) {
      return false;
    }
  }

  return true;
}

function convertJSONToVector(obj) {
  const vec = new THREE.Vector3(obj.x, obj.y, obj.z);
  return vec;
}

export { getRotationDiferences, getLineVector, isEqual, convertJSONToVector };
