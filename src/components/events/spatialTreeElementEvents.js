import * as SubsetBuilder from "../../helpers/subsetBuilder";

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
 * @param {Integer} expressID
 */
function processLeafNodeEvents(
  SelfReference,
  CategoryReference,
  LevelReference,
  ModelReference,
  expressID,
  modelIdx
) {
  let isEnabled = true;

  // (listener, self) click => show/hide self
  SelfReference.DOMElement.addEventListener("click", (e) => {
    e.stopPropagation();
    isEnabled = !isEnabled;
    handleSubset(expressID, modelIdx, isEnabled);
  });
  // (listener, category) toggleCategory (payload = isEnabled: boolean) => show/hide self
  CategoryReference.DOMElement.addEventListener("toggleCategory", (e) => {
    isEnabled = e.detail.isEnabled;
    handleSubset(expressID, modelIdx, isEnabled);
  });
  // (listener, level) toggleLevel (payload = isEnabled: boolean) => show/hide self
  LevelReference.DOMElement.addEventListener("toggleLevel", (e) => {
    isEnabled = e.detail.isEnabled;
    handleSubset(expressID, modelIdx, isEnabled);
  });
  // (listener, model) toggleModel (payload = isEnabled: boolean) => show/hide self
  ModelReference.DOMElement.addEventListener("toggleModel", (e) => {
    isEnabled = e.detail.isEnabled;
    handleSubset(expressID, modelIdx, isEnabled);
  });
  // (listener, model) toggleGlobalCategory (payload = isEnabled: boolean, categoryType: string) => show/hide self
  ModelReference.DOMElement.addEventListener("toggleGlobalCategory", (e) => {
    const categoryType = e.detail.categoryType;
    if (CategoryReference.name == categoryType || categoryType == "all") {
      isEnabled = e.detail.isEnabled;
      handleSubset(expressID, modelIdx, e.detail.isEnabled);
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
  DOMElement.addEventListener("click", (e) => {
    e.stopPropagation();
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
  DOMElement.addEventListener("click", (e) => {
    e.stopPropagation();
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
 * @param {HTMLElement} DOMElement building DOM element
 */
function processBuildingEvents(DOMElement) {
  // (listener, self) Click => (dispatch: "toggleModel", self, payload = isEnabled: boolean)
  let isEnabledLevels = true;
  DOMElement.addEventListener("click", (e) => {
    e.stopPropagation();
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
 * @param {Integer} expressID object expressID
 * @param {Integer} modelIdx identifies which model to manipulate
 * @param {Boolean} isEnabled
 */
function handleSubset(expressID, modelIdx, isEnabled) {
  if (isEnabled) SubsetBuilder.addToSubset(modelIdx, expressID)
  else SubsetBuilder.removeFromSubset(modelIdx, expressID)
}

export {
  processLeafNodeEvents,
  processCategoryNodeEvents,
  processLevelEvents,
  processBuildingEvents,
};
