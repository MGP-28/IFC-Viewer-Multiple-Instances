import { createElement } from "../../helpers/generic/domElements";
import { buildIcon } from "../generic/icon";

function renderFeatureContainer(icon, header, name) {

  const featureContainer = createElement("div", {classes: ["tools-side-feature"]});
  featureContainer.innerHTML = `
    <div class="tools-side-feature-icon"></div>
    <div class="tools-side-feature-header">${header}</div>
    <div class="tools-side-feature-close"></div>
    <div class="tools-side-feature-name">${name}</div>
    <div class="tools-side-feature-content"></div>
    `;


  const iconClose = buildIcon("x");
  const closeWrapper = featureContainer.getElementsByClassName("tools-side-feature-close")[0];
  closeWrapper.classList.add("interaction-cursor")
  closeWrapper.appendChild(iconClose);
  

  const iconMain = buildIcon(icon);
  const iconWrapper = featureContainer.getElementsByClassName("tools-side-feature-icon")[0];
  iconWrapper.classList.add("interaction-cursor")
  iconWrapper.appendChild(iconMain);

  iconWrapper.addEventListener("click", (e) => {
    featureContainer.classList.toggle("feature-active")
  })

  closeWrapper.addEventListener("click", (e) => {
    featureContainer.classList.remove("feature-active")
  })

  return featureContainer;
}

export { renderFeatureContainer }