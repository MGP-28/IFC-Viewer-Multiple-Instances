import { clipping } from "../../helpers/clippingPlanes";
import featureRenderingHandler from "../../helpers/navbar/featureRenderingHandler";
import NavbarItem from "../../models/navbar/NavbarItemData";
import { userInteractions } from "../../stores/userInteractions";

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function build(navItem) {
  document.addEventListener("openClippingPlanes", (e) => {
    navItem.isActive;
    featureRenderingHandler(navItem);
  });
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function load(navItem) {
  userInteractions.clippingPlanes = true;
  clipping(true);
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function unload(navItem) {
  userInteractions.clippingPlanes = false;
  clipping(false);
}

export { build, load, unload };
