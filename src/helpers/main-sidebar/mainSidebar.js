import NavbarItem from "../../models/navbar/NavbarItemData";

let sidebarEl = undefined;
let featuresWrapper = undefined;
let tabsWrapper = undefined;

let loaded = {
    main: undefined,
    split: undefined
};

/**
 * Initialize references for sidebar logic
 */
function getReferences() {
  sidebarEl = document.getElementById("main-sidebar");
  featuresWrapper = sidebarEl.children[0];
  tabsWrapper = sidebarEl.children[1];
}

/**
 * Loads feature into sidebar. Previously loaded feature is removed first
 * @param {NavbarItem} navItem
 */
function loadFeatureIntoSidebar(navItem) {
  if (sidebarEl === undefined) getReferences();
  if (loaded.main) unloadFeatureFromSidebar();
}

/**
 *
 * @param {NavbarItem} navItem
 */
function loadFeatureIntoSidebarAsSplit(navItem) {
  //
}

/**
 *  Unloads all features showing on sidebar
 */
function unloadFeatureFromSidebar() {
    if(loaded.main !== undefined) featuresWrapper.removeChild(loaded.main.component);
    if(loaded.split !== undefined) featuresWrapper.removeChild(loaded.split.component);
}

export {
  loadFeatureIntoSidebar,
  loadFeatureIntoSidebarAsSplit,
  unloadFeatureFromSidebar,
};
