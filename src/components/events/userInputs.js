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
  console.log("dragging");

  ClippingPlanesStore.setDragFinalPositions(event.clientX, event.clientY);
  const visualPlane = ClippingPlanesStore.foundPlane.object;
  const vNormal =
  ClippingPlanesStore.normals[ClippingPlanesStore.selectedPlaneIdx];

  console.log('normals', ClippingPlanesStore.normals)
  console.log("vp", visualPlane);
  console.log("vN", vNormal);
  console.log('position', visualPlane.position)

  const key = vNormal.y !== 0 ? "y" : "x";
  const initialPosition = ClippingPlanesStore.dragPositions.initial[key];
  const finalPosition = ClippingPlanesStore.dragPositions.final[key];
  const dif = -0.1 * (finalPosition - initialPosition);
  visualPlane.position[key] += dif;
  const cuttingPlane =
    ClippingPlanesStore.clippingPlanes[ClippingPlanesStore.selectedPlaneIdx];
  cuttingPlane.constant = cuttingPlane.constant + dif;
  ClippingPlanesStore.setDragInitialPositions(event.clientX, event.clientY);
}
