import * as THREE from "three";
import * as Materials from "../configs/materials";
import * as ClippingPlanesStore from "../stores/clippingPlanes";
import * as ModelStore from "../stores/models";
import * as SceneStore from "../stores/scene";

let visualPlanes = [];
let visualPlane = undefined;
let planeElevation = undefined;
let frontMesh = undefined;
let backMesh = undefined;
let planeMesh = undefined;
let plane = new THREE.Plane();

export default function clipping() {
  if (ModelStore.models.length > 0) {
    const mesh = ModelStore.models[0].model;
    const geometry = ModelStore.models[0].model.geometry;

    const bbox = new THREE.BoxHelper(mesh, 0xff0000);

    const box3 = new THREE.Box3();
    box3.setFromObject(bbox);
    const size = new THREE.Vector3();
    const planeSize = box3.getSize(size);
    const center = new THREE.Vector3();
    const planePosition = box3.getCenter(center);
    const planeMaterial = Materials.materials.clipping;
    visualPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(planeSize.x + 6, planeSize.z + 6),
      planeMaterial
    );
    visualPlane.position.x = planePosition.x;
    visualPlane.position.y = planePosition.y;
    visualPlane.position.z = planePosition.z;
    visualPlane.rotation.x = -0.5 * Math.PI;
    visualPlane.material.side = THREE.DoubleSide;
    planeElevation = planePosition.y;

    visualPlanes.push(visualPlane);

    const planeNormal = new THREE.Vector3(0, -1, 0).normalize();
    const forwardVector = new THREE.Vector3(0, 0, -1);

    plane = new THREE.Plane(planeNormal, planeElevation);
    const planes = [plane]; 

    ClippingPlanesStore.addClippingPlane(undefined, visualPlane);
    SceneStore.scene.add(visualPlane);

    for (const subMat in mesh.material) {
      mesh.material[subMat].clippingPlanes = planes;
    }

    Materials.materials.frontFaceStencilMat.clippingPlanes = planes;
    Materials.materials.backFaceStencilMat.clippingPlanes = planes;

    frontMesh = new THREE.Mesh(geometry, Materials.materials.frontFaceStencilMat);
    frontMesh.rotation.copy(mesh.rotation);
    SceneStore.scene.add(frontMesh);

    backMesh = new THREE.Mesh(geometry, Materials.materials.backFaceStencilMat);
    backMesh.rotation.copy(mesh.rotation);
    SceneStore.scene.add(backMesh);

    planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeSize.x + 6, planeSize.z + 6),
      Materials.materials.planeStencilMat
    );
    planeMesh.scale.setScalar(100);
    plane.coplanarPoint(planeMesh.position);
    planeMesh.quaternion.setFromUnitVectors(forwardVector, planeNormal);
    planeMesh.renderOrder = 1;

    SceneStore.scene.add(planeMesh);
  }
}
