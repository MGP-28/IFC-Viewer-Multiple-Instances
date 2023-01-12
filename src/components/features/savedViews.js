import { emitGlobalEvent } from "../../helpers/emitEvent";
import { loadCSS } from "../../helpers/generic/cssLoader";
import { renderSavedViews } from "../../helpers/savedViews";
import { navbarItems } from "../../stores/navbarItems";
import { userInteractions } from "../../stores/userInteractions";

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function build(navItem) {
  const element = renderSavedViews();


  document.addEventListener("openSavedViews", (e) => {
    navItem.isActive = true;
    featureRenderingHandler(navItem);
  });

  return element;
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function load(navItem) {
  userInteractions.savedViews = true;
  if(!userInteractions.clippingPlanes) {
    const clippingPlanesRef = navbarItems["clippingPlanes"];

    if(clippingPlanesRef.isRendered) emitGlobalEvent("openClippingPlanes");
    else clippingPlanesRef.navbarItem.click();
  }
  // toggleSavedViews(true);
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function unload(navItem) {
  userInteractions.savedViews = false;
  // toggleSavedViews(false);
}

export { build, load, unload };