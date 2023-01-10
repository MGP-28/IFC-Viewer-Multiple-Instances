import { loadCSS } from "../../helpers/generic/cssLoader";
import { createElement } from "../../helpers/generic/domElements";

/**
 * Render sidebar to be filled with feature content
 */
function render() {
  const mainSidebar = createElement("div", {
    id: "main-sidebar",
    classes: ["hidden"]
  });

  mainSidebar.innerHTML = `
    <div class="main-sidebar-features"></div>
    <div class="main-sidebar-feature-tabs-wrapper"></div>
  `;

  document.body.appendChild(mainSidebar);
  loadCSS("./src/assets/css/sidebar.css");

  document.addEventListener("featureLoaded", (e) => {
    const contentEl = mainSidebar.getElementsByClassName("main-sidebar-features")[0];
    if(contentEl.children.length > 0) mainSidebar.classList.toggle("hidden", false);
  });

  document.addEventListener("featureUnloaded", (e) => {
    const contentEl = mainSidebar.getElementsByClassName("main-sidebar-features")[0];
    if(contentEl.children.length == 0) mainSidebar.classList.toggle("hidden", true);
  });
}

export { render as renderMainSidebar };
