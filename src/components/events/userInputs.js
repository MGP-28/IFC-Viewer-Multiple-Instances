import { emitGlobalEvent } from "../../helpers/emitEvent";
import {
  pickObject,
  pickClippingPlane,
  pickCrossPlane,
} from "../../helpers/raytracing";
import * as ClippingPlanesStore from "../../stores/clippingPlanes";
import { userInteractions } from "../../stores/userInteractions";
import * as Materials from "../../configs/materials";
import { controls, scene } from "../../stores/scene";
import * as THREE from "three";
import { clippingConfigs } from "../../configs/clippingPlanes";
import { consoleLogObject } from "../../helpers/generic/logging";
import { getCameraData, setCameraData } from "../../helpers/camera";
import { Vector3 } from "three";
import { updatePlanesPositions } from "../../helpers/clippingPlanes";

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
        if (userInteractions.draggingPlane) await dragClippingPlane(event);
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
    canvas.onmousedown = async (event) => {
      isMouseDragging = true;

      // clipping plane
      if (!ClippingPlanesStore.foundPlane) return;

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

    let savedView = {
      camera: {},
      clipping: {
        min: new THREE.Vector3(1, 2, 3),
        max: new THREE.Vector3(-1, 1, 0),
      },
    };

    window.addEventListener("keydown", (event) => {
      const keyPressed = event.code;
      switch (keyPressed) {
        case "ControlLeft":
          userInteractions.controlActive = true;
          break;
        case "KeyT": {
          savedView.camera = getCameraData();
          if (userInteractions.clippingPlanes) {
            savedView.clipping.min = ClippingPlanesStore.edgePositions.currentMin.clone();
            savedView.clipping.max = ClippingPlanesStore.edgePositions.currentMax.clone();
          }
          break;
        }
        case "KeyL": {
          setCameraData(savedView);
          ClippingPlanesStore.edgePositions.currentMin =
            savedView.clipping.min.clone();
          ClippingPlanesStore.edgePositions.currentMax =
            savedView.clipping.max.clone();
          if (userInteractions.clippingPlanes) updatePlanesPositions();
          break;
        }
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

async function moveClippingPlane(event) {
  // disable camera
  controls.enabled = false;
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
  controls.enabled = true;
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
