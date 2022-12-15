import { icons } from "../configs/icons";
import { emitEventOnElement } from "../helpers/emitEvent";
import { createElement } from "../helpers/generic/domElements";
import { buildIcon } from "./generic/icon";
import { buildModal } from "./generic/modal";

/**
 * 
 * @param {*} props title, subtitle, icon
 * @param {boolean} preventPropagation default: true, prevents click propagation from content to popup
 * @returns 
 */
function render(props, preventPropagation = true) {
  const popup = buildModal();
  popup.innerHTML = `
    <div class="popup-header-wrapper">
        <div class="popup-header-content"></div>
    </div>
  `;
  const wrapper = popup.firstElementChild;

  // Header
  const header = buildHeader();
  // inserts node on top
  wrapper.insertBefore(header, wrapper.firstElementChild);

  const close = header.getElementsByClassName("popup-header-close")[0];
  handleStates();

  if (preventPropagation) {
    wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  return popup;

  // aux functions in scope

  function handleStates() {
    const triggers = [popup, close];
    triggers.forEach((element) => {
      element.addEventListener("click", (e) => {
        emitEventOnElement(popup, "toggle");
      });
    });
  }

  function buildHeader() {
    const header = createElement("div", {
      classes: ["popup-header"],
    });
    header.innerHTML = `
        <div class="popup-header-text">${props.title}</div>
        <div class="popup-header-subtitle">${props.subtitle}</div>
        `;

    // add icons
    const icon = buildIcon(props.icon);
    icon.classList.add("popup-header-icon");
    header.insertBefore(icon, header.firstElementChild);

    const close = buildIcon(icons.close);
    close.classList.add("popup-header-close");
    header.insertBefore(close, header.lastElementChild);

    return header;
  }
}

export { render as buildPopupWithHeader };
