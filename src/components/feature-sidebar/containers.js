import { createElement } from "../../helpers/generic/domElements";
import { buildIcon } from "../generic/icon";

function renderFeatureContainer(icon, header, name) {
  // build container and content
  const featureContainer = createElement("div", {
    classes: ["tools-side-feature"],
  });
  featureContainer.innerHTML = `
    <div class="tools-side-feature-icon"></div>
    <div class="tools-side-feature-header">${header}</div>
    <div class="tools-side-feature-close"></div>
    <div class="tools-side-feature-name">${name}</div>
    <div class="tools-side-feature-content"></div>
  `;

  // add icons
  const iconClose = buildIcon("x");
  const closeWrapper = featureContainer.getElementsByClassName(
    "tools-side-feature-close"
  )[0];
  closeWrapper.classList.add("not-ready");
  closeWrapper.appendChild(iconClose);

  const iconMain = buildIcon(icon);
  const iconWrapper = featureContainer.getElementsByClassName(
    "tools-side-feature-icon"
  )[0];
  iconWrapper.classList.add("not-ready");
  iconWrapper.appendChild(iconMain);

  // manage events
  let isActive = false;
  eventControl();

  function eventControl() {
    featureContainer.addEventListener("featureReady", () => {
      iconWrapper.classList.remove("not-ready");
      iconWrapper.classList.add("interaction-cursor");
      iconWrapper.addEventListener("click", (e) => {
        isActive = !isActive;
        animationControl(isActive);
      });

      closeWrapper.addEventListener("click", (e) => {
        isActive = false;
        animationControl(isActive);
      });
    });
  }

  function animationControl(isActive) {
    if (isActive) {
      featureContainer.classList.remove("closing");
      featureContainer.classList.add("feature-active");
      featureContainer.classList.add("opening");
      setTimeout(() => {
        featureContainer.classList.remove("opening");
      }, 500);
    } else {
      featureContainer.classList.add("closing");
      setTimeout(() => {
        featureContainer.classList.remove("feature-active");
        featureContainer.classList.remove("closing");
      }, 500);
    }
  }

  return featureContainer;
}

export { renderFeatureContainer };
