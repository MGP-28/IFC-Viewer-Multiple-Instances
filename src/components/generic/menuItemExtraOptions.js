import { icons } from "../../configs/icons";
import { emitCustomEventOnElement } from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import { buildIcon } from "./icon";

/**
 * Dimensions: 30 x 25 px
 *
 * Call "addOptionToMenuExtras" to add an option to the menu
 * @returns HTML element
 */
function render() {
  // render base UI
  const element = createElement("div", {
    classes: ["styling-menu-extras"],
  });

  const icon = buildIcon(icons.dots);
  icon.title = "More options";
  element.appendChild(icon);

  const list = createElement("ul");
  list.classList.add("hidden", "styling-menu-extras-list");
  element.appendChild(list);

  handleEvents();

  let status = false;

  function handleEvents() {
    window.addEventListener("click", (e) => {
      if (!status) return;

      const elements = [icon, list];
      if (elements.includes(e.target)) return;

      icon.click();
    });

    icon.addEventListener("click", (e) => {
      e.stopPropagation();

      status = !status;
      toggleStatus(status);

      if (status) updatePosition();
    });

    list.addEventListener("click", (e) => {
      e.stopPropagation();
      icon.click();
    });

    function updatePosition() {
      const id = setInterval(() => {
        if (!status) clearInterval(id);

        list.style.left = "0px";
        list.style.top = "0px";
        const menuBoundingData = element.getBoundingClientRect();
        const listBoundingData = list.getBoundingClientRect();
        const newPosition = {
          x: menuBoundingData.right - listBoundingData.left - listBoundingData.width,
          y: menuBoundingData.bottom - listBoundingData.top,
        };
        list.style.left = newPosition.x + "px";
        list.style.top = newPosition.y + "px";
      }, 20);
    }
  }

  function toggleStatus(status) {
    list.classList.toggle("hidden", !status);
    element.classList.toggle("active", status);
  }

  return element;
}

/**
 *
 * @param {*} element Menu element
 * @param {*} options key: {text, idx} -> idx will be filled
 */
function renderMultipleOptions(element, options) {
  for (const key in options) {
    if (Object.hasOwnProperty.call(options, key)) {
      const option = options[key];
      option.idx = renderOption(element, option.text);
    }
  }
}

/**
 * On selection, a event "optionSelected" is dispatched on the element, where the detail has a idx corresponding to which item was selected
 * @param {*} element Menu element
 * @param {*} text String to show user
 * @returns List item index (idx)
 */
function renderOption(element, text) {
  // Capitalize first letter
  const textContent = text.charAt(0).toUpperCase() + text.slice(1);
  // Create list item
  const li = createElement("li", {
    textContent,
  });
  const list = element.getElementsByTagName("ul")[0];
  list.appendChild(li);
  // Handle events
  let idx = list.children.length;
  li.addEventListener("click", (e) => {
    emitCustomEventOnElement(element, "optionSelected", { idx });
  });
  // Reference for parent
  return idx;
}

export {
  render as renderMenuItemExtrasComponent,
  renderOption as addOptionToMenuExtras,
  renderMultipleOptions as addMultiplesOptionsToMenuExtras,
};
