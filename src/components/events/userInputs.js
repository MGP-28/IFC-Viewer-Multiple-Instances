import { pick } from "../../helpers/raytracing";

export default function startUserInputs() {

    document.addEventListener("wereReady", () => {

        // Double-click => highlights and shows details of pointed object
        window.ondblclick = (event) => pick(event, true);

        // Mouse move => highlights object being hovered
        window.onmousemove = (event) => pick(event, false);
    })  
}