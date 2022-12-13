import { emitGlobalEvent } from "../../helpers/emitEvent";
import { pickObject, pickClippingPlane } from "../../helpers/raytracing";
import * as ClippingPlanesStore from "../../stores/clippingPlanes";
import { userInteractions } from "../../stores/userInteractions";
import * as Materials from "../../configs/materials";
import { controls } from "../../stores/scene";

let isMouseDragging = false;
const canvas = document.getElementById("three-canvas");

export default function startUserInputs() {
  document.addEventListener("wereReady", () => {
    emitGlobalEvent("loadingComplete");

    // Double-click => highlights and shows details of pointed object
    canvas.ondblclick = (event) => pickObject(event, true);

    // Mouse move => highlights object being hovered
    canvas.onmousemove = async (event) => {
      if (isMouseDragging) {
        if (userInteractions.draggingPlane) dragClippingPlane(event);
        return;
      }
      if (userInteractions.clippingPlanes) {
        const isPlaneFound = await pickClippingPlane(event);
        if (!isPlaneFound) resetVisualPlanesColoring();
        else highlightVisualPlane();
      } else pickObject(event, false);
    };

    let isMovingPlanes = false;
    // Prevents highlighting when moving camera (more fluid movement)
    canvas.onmousedown = (event) => {
      isMouseDragging = true;

      // clipping plane
      if (!ClippingPlanesStore.foundPlane) return;

      isMovingPlanes = true;

      // plane moving logic
      moveClippingPlane(event);
    };
    canvas.onmouseup = (event) => {
      isMouseDragging = false;

      // clipping plane
      if (!isMovingPlanes) return;

      isMovingPlanes = false;

      // plane end movement logic
      stopMovingClippingPlane(event);
    };
    window.addEventListener("keydown", (event) => {
      const keyPressed = event.code;
      switch (keyPressed) {
        case "ControlLeft":
          userInteractions.controlActive = true;
          break;

        default:
          break;
      }
    });
    window.addEventListener("keyup", (event) => {
      const keyPressed = event.code;
      switch (keyPressed) {
        case "ControlLeft":
          userInteractions.controlActive = false;
          break;

        default:
          break;
      }
    });
  });
}

let _opacity = undefined;
let _color = undefined;
let _uuid = undefined;
function resetVisualPlanesColoring() {
  if (!_uuid) return;
  for (let idx = 0; idx < ClippingPlanesStore.visualPlanes.length; idx++) {
    const visualPlane = ClippingPlanesStore.visualPlanes[idx];
    visualPlane.material.opacity = _opacity;
    visualPlane.material.color = _color;
  }
  _uuid = undefined;
}

function highlightVisualPlane() {
  const visualPlane = ClippingPlanesStore.foundPlane.object;

  if (visualPlane.uuid == _uuid) return;

  resetVisualPlanesColoring();

  const noRef = { ...visualPlane };
  _uuid = noRef.uuid;
  if (!_opacity) _opacity = noRef.material.opacity;
  if (!_color) _color = noRef.material.color;

  visualPlane.material.opacity = 0.28;
  visualPlane.material.color = Materials.materials.highlighted.color;
}

function moveClippingPlane(event) {
  // disable camera
  controls.enabled = false;
  // drag plane
  userInteractions.draggingPlane = true;
  ClippingPlanesStore.setDragInitialPositions(event.clientX, event.clientY);
}

function stopMovingClippingPlane(event) {
  // enable camera
  controls.enabled = true;
  // stop plane
  userInteractions.draggingPlane = false;
  ClippingPlanesStore.resetDragPositions();
}

function dragClippingPlane(event) {
  ClippingPlanesStore.setDragFinalPositions(event.clientX, event.clientY);
  const visualPlane = ClippingPlanesStore.foundPlane.object;
  const vNormal =
    ClippingPlanesStore.normals[ClippingPlanesStore.selectedPlaneIdx];

  const key = vNormal.y !== 0 ? "y" : "x";
  const initialPosition = ClippingPlanesStore.dragPositions.initial[key];
  const finalPosition = ClippingPlanesStore.dragPositions.final[key];

  const multiplier = userInteractions.controlActive ? -0.02 : -0.1;
  const dif = multiplier * (finalPosition - initialPosition);

  const axleOfMovement = key == "y" ? key : vNormal.x !== 0 ? "x" : "z";
  let positionInAxle = visualPlane.position[axleOfMovement];
  positionInAxle += dif;
  const absoluteMinPosition =
    ClippingPlanesStore.edgePositions.min[axleOfMovement];
  const absoluteMaxPosition =
    ClippingPlanesStore.edgePositions.max[axleOfMovement];

  // Checks for plane positioning reaching the minimum or maximum
  if (absoluteMinPosition > positionInAxle)
    positionInAxle = absoluteMinPosition;
  else if (absoluteMaxPosition < positionInAxle)
    positionInAxle = absoluteMaxPosition;
  visualPlane.position[axleOfMovement] = positionInAxle;

  const edgeVectorChanged = (vNormal[axleOfMovement] > 0) ? "currentMin" : "currentMax"
  ClippingPlanesStore.edgePositions[edgeVectorChanged][axleOfMovement] = positionInAxle;

  const cuttingPlane =
    ClippingPlanesStore.clippingPlanes[ClippingPlanesStore.selectedPlaneIdx];

  const newConstant = positionInAxle * vNormal[axleOfMovement] * -1;
  cuttingPlane.constant = newConstant;

  ClippingPlanesStore.setDragInitialPositions(event.clientX, event.clientY);
}
