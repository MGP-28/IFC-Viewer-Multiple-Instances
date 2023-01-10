import { loadCSS } from "../../helpers/generic/cssLoader";
import { createElement } from "../../helpers/generic/domElements";

/**
 * Render sidebar to be filled with feature content
 */
function render() {
  const mainSidebar = createElement("div", {
    id: "main-sidebar"
  });

  mainSidebar.innerHTML = `
    <div class="main-sidebar-features"></div>
    <div class="main-sidebar-feature-tabs-wrapper"></div>
  `

  document.body.appendChild(mainSidebar);
  loadCSS("./src/assets/css/sidebar.css");
}

export { render as renderMainSidebar };
