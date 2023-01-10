
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
  if (loaded.length > 1) loaded[1].unload();
  addElement(navItem);
}

// /**
//  *
//  * @param {NavbarItem} navItem
//  */
// function loadFeatureIntoSidebarAsSplit(navItem) {
//   if (sidebarEl === undefined) getReferences();
//   if (loaded.length > 1) unloadFeatureFromSidebar(1);
//   addElement(navItem);
// }

/**
 * Unloads features from sidebar. If a component is specified, only removes the specific component
 * @param {HTMLElement?} navItem Optional - HTML component to remove
 */
function unloadFeatureFromSidebar(navItem) {
  if (navItem.component) {
    const index = loaded.findIndex(x => x.title == navItem.title);
    if(index == -1) return;
    removeElement(index);
  }
  else {
    for (let index = 0; index < loaded.length; index++) {
      removeElement(index);
    }
  }
}

function addElement(navItem) {
  loaded.push(navItem);
  featuresWrapper.appendChild(navItem.component);
}

function removeElement(index) {
  featuresWrapper.removeChild(featuresWrapper.children[index]);
  loaded.splice(index, 1);
}

export {
  loadFeatureIntoSidebar,
  //loadFeatureIntoSidebarAsSplit,
  unloadFeatureFromSidebar,
};
