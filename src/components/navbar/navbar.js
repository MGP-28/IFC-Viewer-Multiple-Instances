import { loadCSS } from "../../helpers/generic/cssLoader";
import { createElement } from "../../helpers/generic/domElements";
import { renderSidebarTab } from "../sidebar/tab";
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

    if(item.hasSidebarTab) {
      item.tabElement = renderSidebarTab(item);
    }
  }

  document.body.appendChild(navbar);
  loadCSS("./src/assets/css/navbar.css");
}

// function handleItemEvents(item) {
//   //
// }

export { render as renderNavbar };
