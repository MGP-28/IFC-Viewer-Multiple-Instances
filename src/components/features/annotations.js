import { renderAnnotations } from "../../helpers/annotations";
import { emitGlobalEvent } from "../../helpers/emitEvent";
import { userInteractions } from "../../stores/userInteractions";
import { loadCSS } from "../../helpers/generic/cssLoader";

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function build(navItem) {
  const element = renderAnnotations();

  loadCSS("./src/assets/css/annotations.css");

  document.addEventListener("openAnnotations", (e) => {
    navItem.isActive = true;
    navItem.build();
  });

  return element;
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function load(navItem) {
  userInteractions.annotations = true;
  emitGlobalEvent("enableAnnotations");
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function unload(navItem) {
  userInteractions.annotations = false;
  emitGlobalEvent("disableAnnotations");
}

export { build, load, unload };
