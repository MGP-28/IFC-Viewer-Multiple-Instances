import * as StoreScene from "../stores/scene";
import * as THREE from "three";
import { cameraConfigs } from "../configs/camera";
import {
  getLineVector,
} from "./generic/vectors";
import { Vector3 } from "three";
import { pickAxlePlane } from "./raytracing";

function getCameraData() {
  const camera = StoreScene.camera;

  // get rotation

  const pointLookedAt = pickAxlePlane();

  // get position
  camera.updateMatrixWorld();
  const vPosition = camera.position.clone();
  // vPosition.applyMatrix3(camera.matrixWorld);

  return {
    position: vPosition,
    pointLookedAt: pointLookedAt,
  };
}

// function setCameraData(id) {
function setCameraData(savedView) {
  const controls = StoreScene.controls;

  controls.enabled = false;

  // configs
  const frames = cameraConfigs.framesPerAnimation;

  // rotation
  const pointLookingAt = pickAxlePlane();
  const finalPointLookedAt = savedView.camera.pointLookedAt;
  const movementVectorRotation = getLineVector(
    pointLookingAt,
    finalPointLookedAt
  );
  const vecByFrameRotation = getFrameVector(movementVectorRotation, frames);

  const currentPointBeingLookedAt = new Vector3();
  currentPointBeingLookedAt.copy(pointLookingAt);

  // position
  const startingPosition = StoreScene.camera.position;
  const finalPosition = savedView.camera.position;
  const movementVectorPosition = getLineVector(startingPosition, finalPosition);
  const vecByFramePosition = getFrameVector(movementVectorPosition, frames);
  const currentPosition = new Vector3();
  currentPosition.copy(startingPosition);

  // animation
  let counter = 0;

  animationLoop();

  controls.enabled = true;

  //
  // Aux functions in scope
  //
  function animationLoop() {
    if (counter == frames) return;
    setTimeout(() => {
      rotationTweening();
      positionTweening();
      counter++;
      animationLoop();
    }, 1);
  }

  function rotationTweening() {
    const newPointLooked = new THREE.Vector3();
    newPointLooked.copy(currentPointBeingLookedAt);
    newPointLooked.add(vecByFrameRotation);

    // Update camera point looked at
    setCameraLookingPoint(newPointLooked);
    // Update current point looked at, for next frame
    currentPointBeingLookedAt.copy(newPointLooked);
  }

  function positionTweening() {
    const newPosition = new THREE.Vector3();
    newPosition.copy(currentPosition);
    newPosition.add(vecByFramePosition);

    // Update camera point looked at
    setCameraPosition(newPosition);
    // Update current point looked at, for next frame
    currentPosition.copy(newPosition);
  }
}

function setCameraLookingPoint(point) {
  const controls = StoreScene.controls;
  controls.target = point;
  controls.update();
}

function setCameraPosition(point){
  const camera = StoreScene.camera;
  camera.position.copy(point);
}

export { getCameraData, setCameraData, setCameraLookingPoint, setCameraPosition };

function getFrameVector(movementVector, frames) {
  const frameVector = new THREE.Vector3();
  frameVector.copy(movementVector);
  frameVector.divideScalar(frames);
  return frameVector;
}
