import { clipping } from "../../helpers/clippingPlanes";
import NavbarItem from "../../models/navbar/NavbarItemData";
import { userInteractions } from "../../stores/userInteractions";

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function build(navItem) {
  document.addEventListener("openClippingPlanes", (e) => {
    navItem.isActive = true;
    navItem.load();
  });
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function load(navItem) {
  console.log('clipping load')
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
