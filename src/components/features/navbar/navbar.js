import { loadCSS } from "../../../helpers/generic/cssLoader";
import { createElement } from "../../../helpers/generic/domElements";
import { navbarItems } from "../../../stores/navbarItems";
import { renderNavbarItem } from "./navbarItem";

/**
 *
 * @param {*} items item list -> item = {text, callFunction, subitems}. Each id has to be different
 */
function render() {
  const navbar = createElement("ul", {
    classes: ["feature-navbar"],
  });

  for (const featureName in navbarItems) {
    if (Object.hasOwnProperty.call(navbarItems, featureName)) {
      const feature = navbarItems[featureName];
      const itemEl = renderNavbarItem(feature);
      navbar.appendChild(itemEl);
    }
  }

  loadCSS("./src/assets/css/navbar.css");

  document.addEventListener("wereReady", append);

  function append() {
    document.body.appendChild(navbar);
    document.removeEventListener("wereReady", append);
  }
}

export { render as renderNavbar };
