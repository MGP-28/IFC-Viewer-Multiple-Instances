import { emitGlobalEvent } from "../../helpers/emitEvent";
import { pick } from "../../helpers/raytracing";

let isMouseDragging = false;

export default function startUserInputs() {
  document.addEventListener("wereReady", () => {
    const canvas = document.getElementById("three-canvas");

    emitGlobalEvent("loadingComplete");

    // Double-click => highlights and shows details of pointed object
    canvas.ondblclick = (event) => pick(event, true);

    // Mouse move => highlights object being hovered
    canvas.onmousemove = (event) => { if (!isMouseDragging) pick(event, false); };

    // Prevents highlighting when moving camera (more fluid movement)
    canvas.onmousedown = (event) => (isMouseDragging = true);
    canvas.onmouseup = (event) => (isMouseDragging = false);
  });
}
