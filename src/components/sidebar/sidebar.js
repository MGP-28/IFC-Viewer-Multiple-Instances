import { loadCSS } from "../../helpers/generic/cssLoader";
import { createElement } from "../../helpers/generic/domElements";

/**
 * Render sidebar to be filled with feature content
 */
function render() {
  loadCSS("./src/assets/css/sidebar.css");

  const leftSidebar = createElement("div", {
    id: "left-sidebar",
    classes: ["main-sidebar", "hidden"],
  });

  const rightSidebar = createElement("div", {
    id: "right-sidebar",
    classes: ["main-sidebar", "hidden"],
  });

  document.body.appendChild(leftSidebar);
  document.body.appendChild(rightSidebar);

  // handle sidebar visibility
  document.addEventListener("featureLoaded", (e) => {
    if (leftSidebar.children.length > 0) leftSidebar.classList.toggle("hidden", false);
    if (rightSidebar.children.length > 0) rightSidebar.classList.toggle("hidden", false);
  });

  document.addEventListener("featureUnloaded", (e) => {
    if (leftSidebar.children.length > 0) leftSidebar.classList.toggle("hidden", true);
    if (rightSidebar.children.length > 0) rightSidebar.classList.toggle("hidden", true);
  });
}

export { render as renderMainSidebar };
