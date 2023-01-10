import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import { buildIcon } from "../generic/icon";

/**
 *
 * @param {NavbarItem} item
 */
function render(item) {
  const mainSidebarFeature = createElement("div", {
    classes: ["main-sidebar-feature"],
  });

  mainSidebarFeature.innerHTML = `
    <span>${item.title}</span>
    <div class="main-sidebar-feature-content"></div>
  `;
  const contentEl = mainSidebarFeature.getElementsByTagName("div")[0];

  const closeIcon = buildIcon(icons.close);
  mainSidebarFeature.insertBefore(closeIcon, contentEl);

  return mainSidebarFeature;
}

export { render as renderSidebarFeature };
