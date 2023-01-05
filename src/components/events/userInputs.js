import { emitGlobalEvent } from "../../helpers/emitEvent";
import {
  pickObject,
  pickClippingPlane,
  pickCrossPlane,
} from "../../helpers/raytracing";
import * as ClippingPlanesStore from "../../stores/clippingPlanes";
import {
  isUserPressingSpecialKeys,
  userInteractions,
} from "../../stores/userInteractions";
import * as Materials from "../../configs/materials";
import * as SceneStore from "../../stores/scene";
import * as THREE from "three";
import { clippingConfigs } from "../../configs/clippingPlanes";
import { renderContextMenu } from "../contextMenu/contextMenu";
import { renderContextMenuItem } from "../contextMenu/contextMenuItem";
import { renderAnnotationForm } from "../annotation/form";
import { setCameraLookingPoint } from "../../helpers/camera";

let isMouseDragging = false;
const canvas = document.getElementById("three-canvas");

export default function startUserInputs() {
  document.addEventListener("wereReady", () => {
    emitGlobalEvent("loadingComplete");

    // Double-click => highlights and shows details of pointed object
    canvas.ondblclick = (event) => pickObject(event, true, true);

    canvas.onmousemove = async (event) => {
      // When user is present any special key
      if (isUserPressingSpecialKeys()) {
        resetVisualPlanesColoring();
        return;
      }
      // When mouse is dragging (drag clipping plane)
      if (isMouseDragging) {
        if (userInteractions.draggingPlane) await dragClippingPlane(event);
        return;
      }
      // When mouse is just hovering
      if (userInteractions.clippingPlanes) {
        const isPlaneFound = await pickClippingPlane(event);
        if (!isPlaneFound) resetVisualPlanesColoring();
        else highlightVisualPlane();
      } else pickObject(event, true, false);
    };

    let isMovingPlanes = false;
    // Prevents highlighting when moving camera (more fluid movement)
    canvas.onmousedown = async (event) => {
      isMouseDragging = true;

      // clipping plane
      if (
        !ClippingPlanesStore.foundPlane ||
        !userInteractions.clippingPlanes ||
        userInteractions.keyCActive
      )
        return;

      isMovingPlanes = true;

      // plane moving logic
      await moveClippingPlane(event);
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
        case "KeyC":
          userInteractions.keyCActive = true;
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
        case "KeyC": {
          userInteractions.keyCActive = false;
          resetVisualPlanesColoring();
          break;
        }
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

async function moveClippingPlane(event) {
  // disable camera
  toggleCameraControls(false);
  // drag plane
  userInteractions.draggingPlane = true;

  const vNormal =
    ClippingPlanesStore.normals[ClippingPlanesStore.selectedPlaneIdx];
  const key = vNormal.y !== 0 ? "y" : "x";
  const axleOfMovement = key == "y" ? key : vNormal.x !== 0 ? "x" : "z";

  const normals = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1),
  };

  for (const axle in normals) {
    if (axle == axleOfMovement) continue;

    const normal = normals[axle];
    const crossPlane = new THREE.Plane(
      normal,
      ClippingPlanesStore.center[axle]
    );
    ClippingPlanesStore.crossPlane.planes.push(crossPlane);

    // const helper = new THREE.PlaneHelper(crossPlane, 1000, 0x000000);
    // scene.add(helper);
  }

  ClippingPlanesStore.crossPlane.points.start = await pickCrossPlane(event);
}

function stopMovingClippingPlane(event) {
  // enable camera
  toggleCameraControls(true);
  // stop plane
  userInteractions.draggingPlane = false;
  ClippingPlanesStore.resetCrossPlane();
}

async function dragClippingPlane(event, isUserInteraction) {
  const visualPlane = ClippingPlanesStore.foundPlane.object;
  const vNormal =
    ClippingPlanesStore.normals[ClippingPlanesStore.selectedPlaneIdx];

  const axleOfMovement = vNormal.y !== 0 ? "y" : vNormal.x !== 0 ? "x" : "z";

  const multiplier = userInteractions.controlActive
    ? clippingConfigs.multiplier.precision
    : clippingConfigs.multiplier.normal;
  const maximum = clippingConfigs.maxJump;

  const endPoint = await pickCrossPlane(event);

  if (!endPoint) return;

  ClippingPlanesStore.crossPlane.points.end.copy(endPoint);

  const initialPosition = ClippingPlanesStore.crossPlane.points.start;
  const finalPosition = ClippingPlanesStore.crossPlane.points.end;

  let value =
    (finalPosition[axleOfMovement] - initialPosition[axleOfMovement]) *
    multiplier;
  if (value > maximum) value = maximum;
  else if (value < maximum * -1) value = maximum * -1;

  const vectorAxles = {
    x: axleOfMovement == "x" ? value : 0,
    y: axleOfMovement == "y" ? value : 0,
    z: axleOfMovement == "z" ? value : 0,
  };
  const moveVector = new THREE.Vector3(
    vectorAxles.x,
    vectorAxles.y,
    vectorAxles.z
  );

  visualPlane.position.add(moveVector);

  // Checks for plane positioning reaching the minimum or maximum
  const buffer = clippingConfigs.buffer;
  const absoluteMinPosition =
    ClippingPlanesStore.edgePositions.min[axleOfMovement];
  const absoluteMaxPosition =
    ClippingPlanesStore.edgePositions.max[axleOfMovement];
  if (absoluteMinPosition > visualPlane.position[axleOfMovement])
    visualPlane.position[axleOfMovement] = absoluteMinPosition;
  else if (absoluteMaxPosition < visualPlane.position[axleOfMovement])
    visualPlane.position[axleOfMovement] = absoluteMaxPosition;

  const edgeVectorChanged =
    vNormal[axleOfMovement] > 0 ? "currentMin" : "currentMax";
  const edgeVectorOther =
    edgeVectorChanged == "currentMin" ? "currentMax" : "currentMin";

  const relativeEdgePosition =
    ClippingPlanesStore.edgePositions[edgeVectorOther][axleOfMovement];

  if (edgeVectorChanged == "currentMax") {
    if (relativeEdgePosition + buffer > visualPlane.position[axleOfMovement]) {
      visualPlane.position[axleOfMovement] = relativeEdgePosition + buffer;
    }
  } else {
    if (relativeEdgePosition - buffer < visualPlane.position[axleOfMovement]) {
      visualPlane.position[axleOfMovement] = relativeEdgePosition - buffer;
    }
  }

  ClippingPlanesStore.edgePositions[edgeVectorChanged][axleOfMovement] =
    visualPlane.position[axleOfMovement];

  const cuttingPlane =
    ClippingPlanesStore.clippingPlanes[ClippingPlanesStore.selectedPlaneIdx];

  const newConstant =
    visualPlane.position[axleOfMovement] * vNormal[axleOfMovement] * -1;
  cuttingPlane.constant = newConstant;

  ClippingPlanesStore.crossPlane.points.start.copy(
    ClippingPlanesStore.crossPlane.points.end
  );
}

//
// TESTING
//
// window.addEventListener("keydown", (event) => {
//   const keyPressed = event.code;
//   switch (keyPressed) {
//     case "KeyT": {
//       console.log("lets go!");
//       renderText();
//       break;
//     }
//     default:
//       break;
//   }
// });
//
//

window.addEventListener("contextmenu", async (e) => {
  e.preventDefault();

  if (!userInteractions.controlActive) return;

  toggleCameraControls(false);

  const object = await pickObject(e, false);
  // render menu
  const contextMenu = renderContextMenu();
  document.body.appendChild(contextMenu);
  // position menu
  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.style.top = `${e.clientY}px`;

  // Closing event handling
  document.body.addEventListener("mousedown", closeMenu);
  function closeMenu() {
    contextMenu.remove();
    document.body.removeEventListener("mousedown", closeMenu);
    toggleCameraControls(true);
  }

  const menuList = document.getElementById("context-menu-list");

  // Menu content
  if (object) {
    objectContextMenu(object);
    return;
  } else freeContextMenu();

  //
  // Aux functions in scope
  //
  function objectContextMenu(object) {
    // create annotation
    const annotationEl = renderContextMenuItem("Create annotation");
    menuList.appendChild(annotationEl);
    annotationEl.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      const position = object.object.point;
      const form = renderAnnotationForm(position);
      document.body.appendChild(form);

      closeMenu();
    });
    seperatorElement(menuList);

    const cameraPointEl = renderContextMenuItem("Focus camera here");
    menuList.appendChild(cameraPointEl);
    cameraPointEl.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      const position = object.object.point;
      setCameraLookingPoint(position);

      closeMenu();
    });
    seperatorElement(menuList);

    // testing
    testerElement(menuList);
    seperatorElement(menuList);
    testerElement(menuList);
    testerElement(menuList);
    testerElement(menuList);
    seperatorElement(menuList);
    testerElement(menuList);
    testerElement(menuList);
    ////
  }

  function freeContextMenu() {
    console.log("outside object");
  }

  function seperatorElement(menuList) {
    const seperator = renderContextMenuItem("");
    menuList.appendChild(seperator);
  }
});

function toggleCameraControls(isOn) {
  SceneStore.controls.enabled = isOn;
}

let idx = 0;
function testerElement(menuList) {
  const arr = [
    "Tester",
    "I'm real",
    "Dummy",
    "I'm stuck here!",
    "Super important tester for sure",
    "A wizard did this!",
  ];
  const element = renderContextMenuItem(arr[idx]);
  idx = idx == 5 ? 0 : idx + 1;
  menuList.appendChild(element);
}

// function renderText() {
//   const position = {
//     x: 1,
//     y: -1,
//     z: 3,
//   };
//   const text2D = render2DText(position, "Boas");

//   SceneStore.renderer2D.group.add(text2D);

//   window.addEventListener("click", async (e) => {
//     const result = await pickObject(e, false);
//     if (!result) return;
//     text2D.position.copy(found.object.point);
//     // setTimeout(() => {
//     //   text2D.removeFromParent();
//     // }, 2000);
//   });
// }
//
// END TESTING
//
