import NavbarItem from "../../models/navbar/NavbarItemData";

let sidebarEl = undefined;
let featuresWrapper = undefined;
let tabsWrapper = undefined;

let loaded = [];

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
  if (loaded.length > 0) unloadFeatureFromSidebar(0);
  addElement(navItem);
}

/**
 *
 * @param {NavbarItem} navItem
 */
function loadFeatureIntoSidebarAsSplit(navItem) {
  if (sidebarEl === undefined) getReferences();
  if (loaded.length > 1) unloadFeatureFromSidebar(1);
  addElement(navItem);
}

/**
 *  Unloads all features showing on sidebar
 */
function unloadFeatureFromSidebar(index = undefined) {
  if (index) removeElement(index);
  else {
    for (let idx = 0; idx < loaded.length; idx++) {
      removeElement(index);
    }
  }
}

function addElement(navItem) {
  loaded.push(navItem.component);
  featuresWrapper.appendChild(navItem.component);
}

function removeElement(index) {
  featuresWrapper.removeChild(loaded[idx]);
  loaded.splice(index, 1);
}

export {
  loadFeatureIntoSidebar,
  loadFeatureIntoSidebarAsSplit,
  unloadFeatureFromSidebar,
};
