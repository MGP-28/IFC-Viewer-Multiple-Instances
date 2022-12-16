import * as THREE from "three";
import { Scene } from "three";
import { Vector3 } from "three";
import * as Materials from "../configs/materials";
import * as ClippingPlanesStore from "../stores/clippingPlanes";
import * as ModelStore from "../stores/models";
import * as SceneStore from "../stores/scene";
import { userInteractions } from "../stores/userInteractions";

const referenceVectors = {
  x2: new THREE.Vector3(1, 0, 0),
  x1: new THREE.Vector3(-1, 0, 0),
  y2: new THREE.Vector3(0, 1, 0),
  y1: new THREE.Vector3(0, -1, 0),
  z2: new THREE.Vector3(0, 0, 1),
  z1: new THREE.Vector3(0, 0, -1),
};

function clipping(isEnabled) {
  // prevents clipping plane rendering when no models are loaded
  if (ModelStore.models.length == 0) return;

  const meshes = [];
  getMeshes();

  if (!isEnabled) {
    updateModelsMaterials(false);
    removePlanes();
    return;
  }

  if (ClippingPlanesStore.visualPlanes.length > 0) {
    resetPlanes();
    updateModelsMaterials(true);
    return;
  }

  const boundingBox = getBoundingBox();

  // Initialize variables for plane creation
  // get box's min and max vectors
  const vMin = boundingBox.min;
  const vMax = boundingBox.max;
  bufferEdgeVectors(vMin);
  bufferEdgeVectors(vMax);

  function bufferEdgeVectors(vector) {
    for (const axle in vector) {
      vector[axle] = vector[axle] > 0 ? vector[axle] + 1 : vector[axle] - 1;
    }
  }

  ClippingPlanesStore.setEdgePositions(vMin, vMax);

  // Get plane max size
  const boundingBoxSize = new THREE.Vector3();
  boundingBox.getSize(boundingBoxSize);

  const boxCenter = new Vector3();
  boundingBox.getCenter(boxCenter);
  ClippingPlanesStore.center.copy(boxCenter);

  buildWireframe();
  function buildWireframe() {
    const size = {
      x: vMax.x - vMin.x,
      y: vMax.y - vMin.y,
      z: vMax.z - vMin.z,
    };
    const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const wireframeGeometry = new THREE.EdgesGeometry(boxGeometry);
    const wireframeMaterial = Materials.materials.wireframe.clone();
    const wireframe = new THREE.LineSegments(
      wireframeGeometry,
      wireframeMaterial
    );
    for (const axle in boxCenter) {
      wireframe.position[axle] = boxCenter[axle];
    }
    ClippingPlanesStore.addWireframe(wireframe);
    SceneStore.scene.add(wireframe);
  }

  for (const key in referenceVectors) {
    const vNormal = referenceVectors[key];
    // preset for x1 plane
    let width = boundingBoxSize.z;
    let height = boundingBoxSize.y;
    let position = vMin.x;
    let angle = "90º";
    let vAxle = referenceVectors.y2;
    let invertConstant = true;
    // assigns the correct vars for each case
    if (vNormal.x > 0) {
      // values already in preset
    } else if (vNormal.x < 0) {
      position = vMax.x;
      vAxle = referenceVectors.y2;
      angle = "-90º";
      invertConstant = false;
    } else if (vNormal.y > 0) {
      position = vMin.y;
      vAxle = referenceVectors.x2;
      width = boundingBoxSize.x;
      height = boundingBoxSize.z;
    } else if (vNormal.y < 0) {
      position = vMax.y;
      vAxle = referenceVectors.x2;
      angle = "-90º";
      width = boundingBoxSize.x;
      height = boundingBoxSize.z;
      invertConstant = false;
    } else if (vNormal.z > 0) {
      position = vMin.z;
      vAxle = referenceVectors.z2;
      width = boundingBoxSize.y;
      height = boundingBoxSize.x;
    } else if (vNormal.z < 0) {
      position = vMax.z;
      vAxle = referenceVectors.z2;
      angle = "-90º";
      width = boundingBoxSize.y;
      height = boundingBoxSize.x;
      invertConstant = false;
    }
    angle = angle == "90º" ? THREE.Math.degToRad(90) : THREE.Math.degToRad(270);

    buildPlane(vNormal, position, vAxle, angle, width, height, invertConstant);
  }

  // #region Axle plane helpers (debug)
  // // Axle planes, for debug
  //
  // const planeXY = new THREE.Mesh(planeGeom, planeMat);
  // const planeXZ = new THREE.Mesh(planeGeom, planeMat);
  // const planeYZ = new THREE.Mesh(planeGeom, planeMat);

  // // Default plane already occupies XY plane
  // planeXY.rotation.set(0, 0, 0);
  // planeXY.scale.addScalar(100);
  // planeXY.material.clippingPlanes = ClippingPlanesStore.clippingPlanes;
  // SceneStore.scene.add(planeXY);

  // // Rotate around x-axis to occupy XZ plane
  // planeXZ.rotation.set(Math.PI / 2, 0, 0);
  // planeXZ.scale.addScalar(100);
  // planeXZ.material.clippingPlanes = ClippingPlanesStore.clippingPlanes;
  // SceneStore.scene.add(planeXZ);

  // // Rotate around y-axis to occupy YZ plane
  // planeYZ.rotation.set(0, Math.PI / 2, 0);
  // planeYZ.scale.addScalar(100);
  // planeYZ.material.clippingPlanes = ClippingPlanesStore.clippingPlanes;
  // SceneStore.scene.add(planeYZ);
  //
  //
  // #endregion

  updateModelsMaterials(true);

  // #region Auxiliary functions in scope

  function getMeshes() {
    for (let idx = 0; idx < ModelStore.models.length; idx++) {
      const modelInstance = ModelStore.models[idx];
      meshes.push(modelInstance.model);
    }
  }

  /**
   * Renders a bounding box for each model and calculates a container box that fits all bounding boxes inside.
   *
   * This container is the starting point to render the planes
   */
  function getBoundingBox() {
    // cycles each model's min and max vectors and computes the lowest values for minVector and the highest values for maxVector
    const minVector = new Vector3();
    const maxVector = new Vector3();
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

  function buildPlane(
    vNormal,
    position,
    vAxle,
    angle,
    width,
    height,
    invertConstant
  ) {
    // position = position * 2 / 3

    const planeMaterial = Materials.materials.transparent.clone();

    // visual plane
    const visualPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      planeMaterial
    );

    visualPlane.position.copy(boxCenter);

    // cycles axles in position
    for (const key in visualPlane.position) {
      if (vNormal[key] !== 0) visualPlane.position[key] = position;
    }
    visualPlane.rotateOnWorldAxis(vAxle, angle);

    SceneStore.scene.add(visualPlane);

    // cutting plane
    // Align movement with plane normal
    const constant = invertConstant ? position * -1 : position;
    const cuttingPlane = new THREE.Plane(vNormal, constant);

    // Add normal vector and visual and clipping planes to the store
    ClippingPlanesStore.addClippingPlane(visualPlane, cuttingPlane, vNormal);
  }

  function updateModelsMaterials(isClipping) {
    if (!isClipping) {
      assignClippingPlanesToModels([]);
      return;
    }

    assignClippingPlanesToModels(ClippingPlanesStore.clippingPlanes);
    assignClippingPlanesToEachPlane();

    function assignClippingPlanesToModels(planes) {
      // assign each cutting plane as a clipping plane of all models
      for (let idx = 0; idx < meshes.length; idx++) {
        const mesh = meshes[idx];
        for (const subMat in mesh.material) {
          mesh.material[subMat].clippingPlanes = planes;
        }
      }
    }

    function assignClippingPlanesToEachPlane() {
      for (let idx = 0; idx < ClippingPlanesStore.visualPlanes.length; idx++) {
        let clippingPlanes = [];
        const vP = ClippingPlanesStore.visualPlanes[idx];
        for (
          let idx2 = 0;
          idx2 < ClippingPlanesStore.clippingPlanes.length;
          idx2++
        ) {
          const cP = ClippingPlanesStore.clippingPlanes[idx2];
          if (idx == idx2) continue;
          clippingPlanes.push(cP);
        }
        vP.material.clippingPlanes = clippingPlanes;
      }
    }
  }

  /**
   * UNUSED
   */
  function assignClippingPlanes() {
    // assing clipping planes to the planes' materials
    Materials.materials.frontFaceStencilMat.clippingPlanes =
      ClippingPlanesStore.clippingPlanes;
    Materials.materials.backFaceStencilMat.clippingPlanes =
      ClippingPlanesStore.clippingPlanes;
  }

  /**
   * Provides means for stencil rendering on plane cutting (colored cuts)
   * UNUSED
   * @param {} mesh models' mesh
   */
  function buildMeshRenderTextures(mesh) {
    const frontMesh = new THREE.Mesh(
      mesh.geometry,
      Materials.materials.frontFaceStencilMat
    );
    frontMesh.rotation.copy(mesh.rotation);
    SceneStore.scene.add(frontMesh);

    const backMesh = new THREE.Mesh(
      mesh.geometry,
      Materials.materials.backFaceStencilMat
    );
    backMesh.rotation.copy(mesh.rotation);
    SceneStore.scene.add(backMesh);

    assignClippingPlanes();
  }

  function removePlanes() {
    ClippingPlanesStore.hide();
  }

  function resetPlanes() {
    ClippingPlanesStore.reset();
  }

  // #endregion Auxiliary functions in scope
}

 /**
   * 
   * @param {*} positions {vMin, vMax}
   */
 function updatePlanesPositions() {
  const positions = {
    vMin: ClippingPlanesStore.edgePositions.currentMin,
    vMax: ClippingPlanesStore.edgePositions.currentMax
  }
  const visualPlanes = ClippingPlanesStore.visualPlanes;
  const cuttingPlanes = ClippingPlanesStore.clippingPlanes;
  const normals = ClippingPlanesStore.normals;
  
  ClippingPlanesStore.edgePositions.currentMin = positions.vMin.clone();
  ClippingPlanesStore.edgePositions.currentMax = positions.vMax.clone();

  for (let idx = 0; idx < visualPlanes.length; idx++) {
    const visualPlane = visualPlanes[idx];
    const cuttingPlane = cuttingPlanes[idx];
    const normal = normals[idx];

    const axleOfMovement = normal.y !== 0 ? "y" : normal.x !== 0 ? "x" : "z";

    const edgeVector = normal[axleOfMovement] > 0 ? "vMin" : "vMax";

    visualPlane.position[axleOfMovement] = positions[edgeVector][axleOfMovement];

    const newConstant =
      visualPlane.position[axleOfMovement] * normal[axleOfMovement] * -1;
    cuttingPlane.constant = newConstant;
  }

}

export { clipping, updatePlanesPositions }