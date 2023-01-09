import { loadCSS } from "../../helpers/generic/cssLoader";
import { createElement } from "../../helpers/generic/domElements";
import { renderNavbarItem } from "./navbarItem";

/**
 *
 * @param {*} items item list -> item = {text, callFunction, subitems}. Each id has to be different
 */
function render(items) {
  const navbar = createElement("ul", {
    classes: ["feature-navbar"],
  });

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const itemEl = renderNavbarItem(item);
    navbar.appendChild(itemEl);
  }

  document.body.appendChild(navbar);
  loadCSS("./src/assets/css/navbar.css");
}

// function handleItemEvents(item) {
//   //
// }

export { render as renderNavbar };
