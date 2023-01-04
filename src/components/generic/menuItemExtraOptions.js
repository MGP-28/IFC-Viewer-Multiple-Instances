import { icons } from "../../configs/icons";
import { emitCustomEventOnElement } from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import { buildIcon } from "./icon";

let list = undefined;

function render() {
  // render base UI
  const element = createElement("div", {
    classes: ["styling-menu-extras"],
  });

  const icon = buildIcon(icons.dots);
  element.appendChild(icon);

  list = createElement("ul");

  // function to render option


  // event handling on option click
}

/**
 * 
 * @param {*} text String to show user
 * @returns List item index (idx)
 */
function renderOption(text){
    // Capitalize first letter
    const textContent = text.charAt(0).toUpperCase() + text.slice(1);
    // Create list item
    const li = createElement("li", {
        textContent
    });
    // Handle events
    const element = list.parentNode;
    const idx = element.children.length;
    li.addEventListener("click", () => {
        emitCustomEventOnElement(element, "optionSelected", {idx})
    })
    list.appendChild(li);
    // Reference for parent
    return idx;
}

export { render as renderMenuItemExtrasComponent, renderOption as addOptionToMenuExtras };
