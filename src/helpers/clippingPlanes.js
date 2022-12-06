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

let visualPlanes = [];
let visualPlane = undefined;
let planeElevation = undefined;
let frontMesh = undefined;
let backMesh = undefined;
let planeMesh = undefined;
let plane = new THREE.Plane();

export default function clipping() {
  // prevents clipping plane rendering when no models are loaded
  if (ModelStore.models.length == 0) return;

  const meshes = [];
  getMeshes();

  const boundingBox = getBoundingBox();
  SceneStore.scene.add(boundingBox); // test

  return

  const modelBoxContainer = new THREE.Box3();
  modelBoxContainer.setFromObject(boundingBox);

  const modelBoxSize = new THREE.Vector3();
  const planeSize = modelBoxContainer.getSize(modelBoxSize);

  // get vector with center point of box -> to be replaced
  const center = new THREE.Vector3();
  const planePosition = modelBoxContainer.getCenter(center);

  // get box's min and max vectors
  const modelBoxMinVec = modelBoxContainer.min;
  const modelBoxMaxVec = modelBoxContainer.max;

  // #region TEST
  // const geometryTest = new THREE.SphereGeometry(0.5, 32, 16);
  // const materialTest = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
  // const circleTest = new THREE.Mesh(geometryTest, materialTest);
  // circleTest.position.x = 0
  // circleTest.position.y = 2
  // circleTest.position.z = 0
  // SceneStore.scene.add(circleTest);

  const axesHelper = new THREE.AxesHelper(5);
  SceneStore.scene.add(axesHelper);

  // #endregion TEST

  const planeMaterial = Materials.materials.clipping;
  visualPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(planeSize.x + 10, planeSize.z + 10),
    planeMaterial
  );
  visualPlane.position.x = planePosition.x;
  visualPlane.position.y = planePosition.y;
  visualPlane.position.z = planePosition.z;
  visualPlane.rotation.x = -0.5 * Math.PI;
  visualPlane.material.side = THREE.DoubleSide;
  planeElevation = planePosition.y;

  visualPlanes.push(visualPlane);

  const planeNormal = referenceVectors.y1;
  const forwardVector = referenceVectors.z1;

  plane = new THREE.Plane(planeNormal, planeElevation);
  const planes = [plane];

  ClippingPlanesStore.addClippingPlane(undefined, visualPlane);
  SceneStore.scene.add(visualPlane);

  for (const subMat in mesh.material) {
    mesh.material[subMat].clippingPlanes = planes;
  }

  Materials.materials.frontFaceStencilMat.clippingPlanes = planes;
  Materials.materials.backFaceStencilMat.clippingPlanes = planes;

  buildMeshRenderTextures();

  planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(planeSize.x + 6, planeSize.z + 6),
    Materials.materials.planeStencilMat
  );
  planeMesh.scale.setScalar(100);
  plane.coplanarPoint(planeMesh.position);
  planeMesh.quaternion.setFromUnitVectors(forwardVector, planeNormal);
  planeMesh.renderOrder = 1;

  SceneStore.scene.add(planeMesh);

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
  function getBoundingBox(){
    const minVector = new Vector3();
    const maxVector = new Vector3();
    for (let idx = 0; idx < meshes.length; idx++) {
      const mesh = meshes[idx];
      const boundingBox = new THREE.BoxHelper(mesh, 0xff0000);
      const box = new THREE.Box3();
      box.setFromObject(boundingBox);
      // if first model, just copies values
      if(idx == 0) {
        minVector.copy(box.min)
        maxVector.copy(box.max)
        continue;
      }
      // if not, calculates which axle value needs to be replaced
      for (const key in minVector) {
        if(minVector[key] > box.min[key]) minVector[key] = box.min[key];
      }
      for (const key in maxVector) {
        if(maxVector[key] < box.max[key]) maxVector[key] = box.max[key];
      }
    }
    const box3 =  new THREE.Box3(minVector, maxVector);

    const size = {
      x: (box3.max.x - box3.min.x) + 2,
      y: (box3.max.y - box3.min.y) + 2,
      z: (box3.max.z - box3.min.z) + 2
    }
    const center = new Vector3();
    box3.getCenter(center);
    
    const boundingGeometry = new THREE.BoxGeometry( size.x, size.y, size.z );
    const boundingMaterial = new THREE.MeshBasicMaterial( {
      color: 0xffff00,
      opacity: 0.2,
      transparent: true,
      side: THREE.DoubleSide
    } );
    const boundingMesh = new THREE.Mesh( boundingGeometry, boundingMaterial );
    boundingMesh.position.copy(center);

    return boundingMesh;
  }

  function buildPlane(vNormal, vForward, vPosition) {
    //
  }

  /**
   * Provides means for stencil rendering on plane cutting (colored cuts)
   * @param {} mesh models' mesh
   */
  function buildMeshRenderTextures(mesh) {
    frontMesh = new THREE.Mesh(
      mesh.geometry,
      Materials.materials.frontFaceStencilMat
    );
    frontMesh.rotation.copy(mesh.rotation);
    SceneStore.scene.add(frontMesh);

    backMesh = new THREE.Mesh(
      mesh.geometry,
      Materials.materials.backFaceStencilMat
    );
    backMesh.rotation.copy(mesh.rotation);
    SceneStore.scene.add(backMesh);
  }

  // #endregion Auxiliary functions in scope
}
