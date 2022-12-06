import * as THREE from "three";
import { Vector3 } from "three";
import * as Materials from "../configs/materials";
import * as ClippingPlanesStore from "../stores/clippingPlanes";
import * as ModelStore from "../stores/models";
import * as SceneStore from "../stores/scene";

const referenceVectors = {
  x1: new THREE.Vector3(-1, 0, 0).normalize(),
  x2: new THREE.Vector3(1, 0, 0).normalize(),
  y1: new THREE.Vector3(0, -1, 0).normalize(),
  y2: new THREE.Vector3(0, 1, 0).normalize(),
  z1: new THREE.Vector3(0, 0, -1).normalize(),
  z2: new THREE.Vector3(0, 0, 1).normalize(),
};

// let visualPlanes = [];
// let visualPlane = undefined;
// let planeElevation = undefined;
// let frontMesh = undefined;
// let backMesh = undefined;
// let planeMesh = undefined;
// let plane = new THREE.Plane();

export default function clipping() {
  // prevents clipping plane rendering when no models are loaded
  if (ModelStore.models.length == 0) return;

  const meshes = [];
  getMeshes();

  const boundingBox = getBoundingBox();

  // Initialize variables for plane creation
  // get box's min and max vectors
  const vMin = boundingBox.min;
  const vMax = boundingBox.max;

  // Get plane max size
  const boundingBoxSize = new THREE.Vector3();
  boundingBox.getSize(boundingBoxSize);

  const boxCenter = new Vector3();
  boundingBox.getCenter(boxCenter);

  const planes = {
    visual: [],
    cutting: [],
  };

  for (const key in referenceVectors) {
    const vNormal = referenceVectors[key];
    // preset for x1 plane
    let width = boundingBoxSize.z;
    let height = boundingBoxSize.y;
    let position = vMax.x;
    let angle = "90º";
    let vAxle = referenceVectors.y2;
    // assigns the correct vars for each case
    if (vNormal.x > 0) {
      // values already in preset
    } else if (vNormal.x < 0) {
      position = vMin.x;
      vAxle = referenceVectors.y2;
      angle = "-90º";
    } else if (vNormal.y > 0) {
      position = vMax.y;
      vAxle = referenceVectors.x2;
      width = boundingBoxSize.x;
      height = boundingBoxSize.z;
    } else if (vNormal.y < 0) {
      position = vMin.y;
      vAxle = referenceVectors.x2;
      angle = "-90º";
      width = boundingBoxSize.x;
      height = boundingBoxSize.z;
    } else if (vNormal.z > 0) {
      position = vMax.z;
      vAxle = referenceVectors.z2;
      width = boundingBoxSize.y;
      height = boundingBoxSize.x;
    } else if (vNormal.z < 0) {
      position = vMin.z;
      vAxle = referenceVectors.z2;
      angle = "-90º";
      width = boundingBoxSize.y;
      height = boundingBoxSize.x;
    }

    angle = angle == "90º" ? THREE.Math.degToRad(90) : THREE.Math.degToRad(270);

    buildPlane(vNormal, position, vAxle, angle, width, height);
  }

  console.log("visual", planes.visual);

  updateModelsMaterials();

  assignClippingPlanes();

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
    //#endregion render box in scene - comment return for it
  }

  function buildPlane(vNormal, position, vAxle, angle, width, height) {
    const planeMaterial = Materials.materials.transparent;

    // visual plane
    const visualPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      planeMaterial
    );

    visualPlane.position.copy(boxCenter);

    // cycles axles in positon
    for (const key in visualPlane.position) {
      if (vNormal[key] !== 0) visualPlane.position[key] = position;
    }
    visualPlane.material.side = THREE.DoubleSide;

    visualPlane.rotateOnWorldAxis(vAxle, angle);

    planes.visual.push(visualPlane);
    SceneStore.scene.add(visualPlane);

    // return;

    // cutting plane

    const cuttingPlaneMesh = visualPlane.clone(true);
    cuttingPlaneMesh.material = Materials.materials.transparent;

    planes.cutting.push(cuttingPlaneMesh);
    SceneStore.scene.add(cuttingPlaneMesh);
  }

  function updateModelsMaterials() {
    assignClippingPlanes();
    // assign each cutting plane as a clipping plane of all models
    for (let idx = 0; idx < meshes.length; idx++) {
      const mesh = meshes[idx];
      for (const subMat in mesh.material) {
        mesh.material[subMat].clippingPlanes = planes.cutting;
      }
      buildMeshRenderTextures(mesh);
    }
  }

  function assignClippingPlanes() {
    // assing clipping planes to the planes' materials
    Materials.materials.frontFaceStencilMat.clippingPlanes = planes.cutting;
    Materials.materials.backFaceStencilMat.clippingPlanes = planes.cutting;
  }

  /**
   * Provides means for stencil rendering on plane cutting (colored cuts)
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
  }

  // #endregion Auxiliary functions in scope

  // test

  const axesHelper = new THREE.AxesHelper(5);
  SceneStore.scene.add(axesHelper);

  function testShape() {
    const geometryTest = new THREE.SphereGeometry(0.5, 32, 16);
    const materialTest = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
    });
    const circleTest = new THREE.Mesh(geometryTest, materialTest);
    circleTest.position.x = 0;
    circleTest.position.y = 2;
    circleTest.position.z = 0;
    SceneStore.scene.add(circleTest);
  }
}
