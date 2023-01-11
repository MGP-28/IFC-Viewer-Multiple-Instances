import { loadCSS } from "../../helpers/generic/cssLoader";
import { createElement } from "../../helpers/generic/domElements";
import featureRenderingHandler from "../../helpers/navbar/featureRenderingHandler";

/**
 * Render sidebar to be filled with feature content
 */
function render() {
  const mainSidebar = createElement("div", {
    id: "main-sidebar",
    classes: ["hidden"],
  });

  mainSidebar.innerHTML = `
    <div class="main-sidebar-features"></div>
    <div id="main-sidebar-feature-tabs-wrapper"></div>
  `;

  document.body.appendChild(mainSidebar);
  loadCSS("./src/assets/css/sidebar.css");

  // handle sidebar visibility
  document.addEventListener("featureLoaded", (e) => {
    const contentEl = mainSidebar.getElementsByClassName("main-sidebar-features")[0];
    if (contentEl.children.length > 0) mainSidebar.classList.toggle("hidden", false);
  });

  document.addEventListener("featureUnloaded", (e) => {
    const contentEl = mainSidebar.getElementsByClassName("main-sidebar-features")[0];
    if (contentEl.children.length == 0) mainSidebar.classList.toggle("hidden", true);
  });

  // handle tabs
  const tabsEl = document.getElementById("main-sidebar-feature-tabs-wrapper");
  tabsEl.addEventListener("tabSelected", (e) => {
    const item = e.detail.item;
    const children = tabsEl.children;
    for (let idx = 0; idx < children.length; idx++) {
      const tabEl = children[idx];
      let active = true;
      if (tabEl.textContent !== item.title) active = false;
      if (item.isActive === active) continue;
      item.isActive = active;
      featureRenderingHandler(item);
    }
  });
}

export { render as renderMainSidebar };
