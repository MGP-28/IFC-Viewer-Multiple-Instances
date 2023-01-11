import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import featureRenderingHandler from "../../helpers/navbar/featureRenderingHandler";
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

  const closeIcon = buildIcon(icons.closeDark);
  mainSidebarFeature.insertBefore(closeIcon, contentEl);

  handleEvents();

  return mainSidebarFeature;

  function handleEvents(){
    closeIcon.addEventListener("click", (e) => {
      item.isActive = false;
      featureRenderingHandler(item);
    })
  }
}

function addContent(mainSidebarFeature, content) {
  const contentEl = mainSidebarFeature.getElementsByTagName("div")[0];
  contentEl.appendChild(content);
}

export { render as renderSidebarFeature, addContent as addContentToSidebarFeature };
