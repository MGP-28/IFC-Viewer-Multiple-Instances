import { emitGlobalEvent } from "../../helpers/emitEvent";
import { pickObject, pickClippingPlane } from "../../helpers/raytracing";
import { foundPlane, visualPlanes } from "../../stores/clippingPlanes";
import { userInteractions } from "../../stores/userInteractions";
import * as Materials from "../../configs/materials";
import { controls, scene } from "../../stores/scene";

let isMouseDragging = false;

export default function startUserInputs() {
  document.addEventListener("wereReady", () => {
    const canvas = document.getElementById("three-canvas");

    emitGlobalEvent("loadingComplete");

    // Double-click => highlights and shows details of pointed object
    canvas.ondblclick = (event) => pickObject(event, true);

    // Mouse move => highlights object being hovered
    canvas.onmousemove = async (event) => {
      if (isMouseDragging) return;
      if (userInteractions.clippingPlanes) {
        const isPlaneFound = await pickClippingPlane(event);
        // if no plane is found, exits
        if (!isPlaneFound) {
          resetVisualPlanesColoring();
          return;
        }
        // if there's a plane being interacted, enable highlight
        highlightVisualPlane();
      } else pickObject(event, false);
    };

    let isMovingPlanes = false;
    // Prevents highlighting when moving camera (more fluid movement)
    canvas.onmousedown = (event) => {
      isMouseDragging = true;

      // clipping plane
      if (!foundPlane) return;

      isMovingPlanes = true;

      // plane moving logic
      moveClippingPlane();
    };
    canvas.onmouseup = (event) => {
      isMouseDragging = false;

      // clipping plane
      if (!isMovingPlanes) return;

      isMovingPlanes = false;

      // plane end movement logic
      stopMovingClippingPlane();
    };
  });
}

let _opacity = undefined;
let _color = undefined;
let _uuid = undefined;
function resetVisualPlanesColoring() {
  if(!_uuid) return;
  for (let idx = 0; idx < visualPlanes.length; idx++) {
    const visualPlane = visualPlanes[idx];
    visualPlane.material.opacity = _opacity;
    visualPlane.material.color = _color;
  }
  _uuid = undefined;
}

function highlightVisualPlane() {
  const visualPlane = foundPlane.object;

  if(visualPlane.uuid == _uuid) return;

  resetVisualPlanesColoring();

  const noRef = {...visualPlane};
  _uuid = noRef.uuid;
  if(!_opacity) _opacity = noRef.material.opacity
  if(!_color) _color = noRef.material.color

  visualPlane.material.opacity = 0.28;
  visualPlane.material.color = Materials.materials.highlighted.color;
}

function moveClippingPlane() {
  // disable camera
  controls.enabled = false;
  // drag plane

}

function stopMovingClippingPlane() {
  // enable camera
  controls.enabled = true;
  // stop plane

}
