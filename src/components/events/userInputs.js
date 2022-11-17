import { pick } from "../../helpers/raytracing";
import { isSelectionFromViewer } from "../../stores/selection";

export default function startUserInputs() {

    document.addEventListener("wereReady", () => {

        // Double-click => highlights and shows details of pointed object
        window.ondblclick = (event) => pick(event, true);

        // Mouse move => highlights object being hovered
        window.onmousemove = (event) => {
            if(!isSelectionFromViewer) return;
            pick(event, false);
        }
    })  
}