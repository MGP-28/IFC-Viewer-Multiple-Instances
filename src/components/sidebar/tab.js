import { emitCustomEventOnElement } from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import featureRenderingHandler from "../../helpers/navbar/featureRenderingHandler";
/**
 *
 * @param {NavbarItem} item
 */
function render(item) {
  const sidebarTab = createElement("div", {
    classes: ["main-sidebar-feature-tab"],
    textContent: item.title,
  });

  handleEvents();

  const parent = document.getElementById("main-sidebar-feature-tabs-wrapper");
  parent.appendChild(sidebarTab);

  return sidebarTab;

  function handleEvents() {
    sidebarTab.addEventListener("click", (e) => {
      item.isActive = !item.isActive;
      featureRenderingHandler(item);
    });

    sidebarTab.addEventListener("loaded", (e) => {
      sidebarTab.classList.toggle("active", true);
    });

    sidebarTab.addEventListener("unloaded", (e) => {
      sidebarTab.classList.toggle("active", false);
    });
  }
}

export { render as renderSidebarTab };
