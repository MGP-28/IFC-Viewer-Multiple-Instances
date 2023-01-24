import { emitGlobalEvent } from "../emitEvent";

let sidebarEls = {
  l: undefined,
  r: undefined,
};

/**
 * Initialize references for sidebar logic
 */
function getReferences() {
  sidebarEls.l = document.getElementById("left-sidebar");
  sidebarEls.r = document.getElementById("right-sidebar");
}

/**
 * Loads feature into sidebar. Previously loaded feature is removed first
 * @param {NavbarItem} navItem
 */
function loadFeatureIntoSidebar(navItem) {
  if (!sidebarEls.l) getReferences();
  
  const sidebarCode = navItem.sidebarPosition.charAt(0);
  const position = navItem.sidebarPosition.charAt(1);
  const sidebar = sidebarEls[sidebarCode];

  console.log('comp', navItem.component);
  
  if (position == 1 && sidebar.firstChild) sidebar.insertBefore(navItem.component, sidebar.firstChild);
  else sidebar.appendChild(navItem.component);

  emitGlobalEvent("featureLoaded");
}


/**
 * Unloads features from sidebar. If a component is specified, only removes the specific component
 * @param {NavbarItem} navItem Optional - navItem containing HTML component to remove
 */
function unloadFeatureFromSidebar(navItem) {
  navItem.component.remove();
  emitGlobalEvent("featureUnloaded");
}

export {
  loadFeatureIntoSidebar,
  //loadFeatureIntoSidebarAsSplit,
  unloadFeatureFromSidebar,
};
