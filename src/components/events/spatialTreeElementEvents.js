import { scene } from "../../stores/scene";

/**
 * Leaf node subset visibility management (event listeners)
 * 
 * (listener, self) click
 * 
 * (listener, category) toggleCategory (payload = isEnabled: boolean)
 * 
 * (listener, level) toggleLevel (payload = isEnabled: boolean)
 * 
 * (listener, model) toggleModel (payload = isEnabled: boolean)
 * 
 * (listener, model) toggleGlobalCategory (payload = isEnabled: boolean, categoryType: string)
 * 
 * @param {NodeReference} SelfReference
 * @param {NodeReference} CategoryReference
 * @param {NodeReference} LevelReference
 * @param {NodeReference} ModelReference
 * @param {Subset} subset
 */
function processLeafNodeEvents(
  SelfReference,
  CategoryReference,
  LevelReference,
  ModelReference,
  subset
) {
  let isEnabled = true;

  // (listener, self) click => show/hide self
  SelfReference.DOMElement.addEventListener("click", () => {
    isEnabled = !isEnabled;
    handleSubset(subset, isEnabled);
  });
  // (listener, category) toggleCategory (payload = isEnabled: boolean) => show/hide self
  CategoryReference.DOMElement.addEventListener("toggleCategory", (e) => {
    isEnabled = e.detail.isEnabled;
    handleSubset(subset, isEnabled);
  });
  // (listener, level) toggleLevel (payload = isEnabled: boolean) => show/hide self
  LevelReference.DOMElement.addEventListener("toggleLevel", (e) => {
    isEnabled = e.detail.isEnabled;
    handleSubset(subset, isEnabled);
  });
  // (listener, model) toggleModel (payload = isEnabled: boolean) => show/hide self
  ModelReference.DOMElement.addEventListener("toggleModel", (e) => {
    isEnabled = e.detail.isEnabled;
    handleSubset(subset, isEnabled);
  });
  // (listener, model) toggleGlobalCategory (payload = isEnabled: boolean, categoryType: string) => show/hide self
  ModelReference.DOMElement.addEventListener("toggleGlobalCategory", (e) => {
    const categoryType = e.detail.categoryType;
    if (CategoryReference.name == categoryType || categoryType == "all") {
      isEnabled = e.detail.isEnabled;
      handleSubset(subset, e.detail.isEnabled);
    }
  });
}

/**
 * Add event dispatching to category node
 * 
 * Dispatch: "toggleCategory", self, payload = isEnabled: boolean
 * @param {HTMLElement} DOMElement category DOM element
 */
function processCategoryNodeEvents(DOMElement) {
  // (listener, self) Click => (dispatch: "toggleCategory", self, payload = isEnabled: boolean)
  let isEnabledCategory = true;
  DOMElement.addEventListener("click", () => {
    isEnabledCategory = !isEnabledCategory;
    const customEvent = new CustomEvent("toggleCategory", {
      detail: {
        isEnabled: isEnabledCategory,
      },
    });
    DOMElement.dispatchEvent(customEvent);
  });
}

/**
 * Add event dispatching to level node
 * 
 * dispatch: "toggleLevel", self, payload = isEnabled: boolean
 * @param {HTMLElement} DOMElement level DOM element
 */
function processLevelEvents(DOMElement) {
  // (listener, self) Click => (dispatch: "toggleLevel", self, payload = isEnabled: boolean)
  let isEnabledLevels = true;
  DOMElement.addEventListener("click", () => {
    isEnabledLevels = !isEnabledLevels;
    const customEvent = new CustomEvent("toggleLevel", {
      detail: {
        isEnabled: isEnabledLevels,
      },
    });
    DOMElement.dispatchEvent(customEvent);
  });
}

/**
 * Add event dispatching to building node
 * 
 * dispatch: "toggleModel", self, payload = isEnabled: boolean
 * @param {HTMLElement} DOMElement buildng DOM element
 */
function processBuildingEvents(DOMElement) {
  // (listener, self) Click => (dispatch: "toggleModel", self, payload = isEnabled: boolean)
  let isEnabledLevels = true;
  DOMElement.addEventListener("click", () => {
    isEnabledLevels = !isEnabledLevels;
    const customEvent = new CustomEvent("toggleModel", {
      detail: {
        isEnabled: isEnabledLevels,
      },
    });
    DOMElement.dispatchEvent(customEvent);
  });
}

/**
 * Enables/disables subset on the scene, depending on "isEnabled"
 * @param {Subset} subset
 * @param {Boolean} isEnabled
 */
function handleSubset(subset, isEnabled) {
  if (isEnabled) scene.add(subset);
  else subset.removeFromParent();
}

export {
  processLeafNodeEvents,
  processCategoryNodeEvents,
  processLevelEvents,
  processBuildingEvents,
};
