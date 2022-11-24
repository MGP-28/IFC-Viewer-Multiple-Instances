import * as SubsetBuilder from "../../helpers/subsetBuilder";
import { models } from "../../stores/models";

/**
 * Leaf node subset visibility management (event listeners)
 *
 * (listener, self) click
 *
 * @param {HTMLElement} DOMElement
 * @param {Integer} expressID
 */
function processLeafNodeEvents(DOMElement, expressID, modelIdx) {
  let isEnabled = true;

  // (listener, self) click => show/hide self
  DOMElement.addEventListener("click", (e) => {
    e.stopPropagation();
    isEnabled = !isEnabled;
    handleSubset([expressID], modelIdx, isEnabled);
  });

  // #region event based toggling (obsolete)
  // Using events -> Weak performance
  // (listener, category) toggleCategory (payload = isEnabled: boolean)
  //
  // (listener, level) toggleLevel (payload = isEnabled: boolean)
  //
  // (listener, model) toggleModel (payload = isEnabled: boolean)
  //
  // (listener, model) toggleGlobalCategory (payload = isEnabled: boolean, categoryType: string)
  //
  // (listener, category) toggleCategory (payload = isEnabled: boolean) => show/hide self
  // CategoryReference.DOMElement.addEventListener("toggleCategory", (e) => {
  //   isEnabled = e.detail.isEnabled;
  //   handleSubset([expressID], modelIdx, isEnabled);
  // });
  // (listener, level) toggleLevel (payload = isEnabled: boolean) => show/hide self
  // LevelReference.DOMElement.addEventListener("toggleLevel", (e) => {
  //   isEnabled = e.detail.isEnabled;
  //   handleSubset([expressID], modelIdx, isEnabled);
  // });
  // (listener, model) toggleModel (payload = isEnabled: boolean) => show/hide self
  // ModelReference.DOMElement.addEventListener("toggleModel", (e) => {
  //   isEnabled = e.detail.isEnabled;
  //   handleSubset([expressID], modelIdx, isEnabled);
  // });
  // // (listener, model) toggleGlobalCategory (payload = isEnabled: boolean, categoryType: string) => show/hide self
  // ModelReference.DOMElement.addEventListener("toggleGlobalCategory", (e) => {
  //   const categoryType = e.detail.categoryType;
  //   if (CategoryReference.name == categoryType || categoryType == "all") {
  //     isEnabled = e.detail.isEnabled;
  //     handleSubset([expressID], modelIdx, e.detail.isEnabled);
  //   }
  // });
  // #endregion event based toggling
}

/**
 * Add event dispatching to category node
 *
 * @param {HTMLElement} DOMElement
 * @param {Integer} modelIdx
 * @param {String} levelName
 * @param {String} categoryName
 */
function processCategoryNodeEvents(
  DOMElement,
  modelIdx,
  levelName,
  categoryName
) {
  let isEnabled = true;
  DOMElement.addEventListener("click", (e) => {
    e.stopPropagation();
    isEnabled = !isEnabled;

    // #region event based toggling (obsolete)
    // Using events -> Weak performance
    // (listener, self) Click => (dispatch: "toggleCategory", self, payload = isEnabled: boolean)
    //
    // const customEvent = new CustomEvent("toggleCategory", {
    //   detail: {
    //     isEnabled: isEnabled,
    //   },
    // });
    // DOMElement.dispatchEvent(customEvent);
    // #endregion event based toggling

    const model = models[modelIdx];
    const level = model.levels.find((x) => x.name == levelName);
    const categoryInLevel = level.categories.find(
      (x) => x.name == categoryName
    );
    const objectIDs = categoryInLevel.ids;
    handleSubset(objectIDs, modelIdx, isEnabled);
  });
}

/**
 * Add event handling to level node
 *
 * @param {HTMLElement} DOMElement level DOM element
 * @param {Integer} modelIdx store index of model to be manipulated
 */
function processLevelEvents(DOMElement, modelIdx, levelName) {
  let isEnabled = true;
  DOMElement.addEventListener("click", (e) => {
    e.stopPropagation();
    isEnabled = !isEnabled;

    // #region event based toggling (obsolete)
    // Using events -> Weak performance
    // (listener, self) Click => (dispatch: "toggleLevel", self, payload = isEnabled: boolean)
    //
    // const customEvent = new CustomEvent("toggleLevel", {
    //   detail: {
    //     isEnabled: isEnabledLevels,
    //   },
    // });
    // DOMElement.dispatchEvent(customEvent);
    // #endregion event based toggling

    const model = models[modelIdx];
    const objectIDs = model.getIDsByLevelName(levelName);
    handleSubset(objectIDs, modelIdx, isEnabled);
  });
}

/**
 * Add event handling to building node
 *
 * @param {HTMLElement} DOMElement building DOM element
 * @param {Integer} modelIdx store index of model to be manipulated
 */
function processBuildingEvents(DOMElement, modelIdx) {
  let isEnabled = true;
  DOMElement.addEventListener("click", (e) => {
    e.stopPropagation();
    isEnabled = !isEnabled;

    // #region event based toggling (obsolete)
    // (listener, self) Click => (dispatch: "toggleModel", self, payload = isEnabled: boolean)
    // Using events -> Weak performance
    //
    // const customEvent = new CustomEvent("toggleModel", {
    //   detail: {
    //     isEnabled: isEnabled,
    //   },
    // });
    // DOMElement.dispatchEvent(customEvent);
    // #endregion

    const model = models[modelIdx];
    const objectIDs = model.getAllIDs();
    handleSubset(objectIDs, modelIdx, isEnabled);
  });
}

/**
 * Enables/disables subset on the scene, depending on "isEnabled"
 * @param {Array.<Integer>} expressIDs object expressID
 * @param {Integer} modelIdx identifies which model to manipulate
 * @param {Boolean} isEnabled
 */
function handleSubset(expressIDs, modelIdx, isEnabled) {
  if (isEnabled) SubsetBuilder.addToSubset(modelIdx, expressIDs);
  else SubsetBuilder.removeFromSubset(modelIdx, expressIDs);
}

export {
  processLeafNodeEvents,
  processCategoryNodeEvents,
  processLevelEvents,
  processBuildingEvents,
};
