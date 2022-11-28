import * as SubsetBuilder from "../../helpers/subsetBuilder";
import * as Models from "../../stores/models";
import * as SelectionStore from "../../stores/selection";

/**
 * Leaf node subset visibility management (event listeners)
 *
 * (listener, self) click
 *
 * @param {HTMLElement} titleEl Node text element (icon parent)
 * @param {HTMLElement} visibilityEl Node icon element
 * @param {Integer} expressID
 */
 async function processLeafNodeEvents(titleEl, visibilityEl, expressID, modelIdx) {
  let isEnabled = true;

  const model = Models.models[modelIdx];
  const loader = model.loader;
  const props = await loader.ifcManager.getItemProperties(0, expressID, true);

  // (listener, self) click => show/hide self
  visibilityEl.addEventListener("click", (e) => {
    e.stopPropagation();
    isEnabled = !isEnabled;
    handleMainSubset([expressID], modelIdx, isEnabled);
  });

  let isSelection = false;

  titleEl.addEventListener("mouseenter", () => {
    SelectionStore.setHighlightedProperties("fake props", [props.expressID], modelIdx, false);
  });

  titleEl.addEventListener("mouseleave", () => {
    SelectionStore.resetHighlightedProperties();
  });

  titleEl.addEventListener("click", () => {
    if (isSelection) {
      SelectionStore.resetSelectedProperties();
      toggleActiveCSSClass(titleEl, false);
    } else {
      SelectionStore.setSelectedProperties(props, [props.expressID], modelIdx, false);
      toggleActiveCSSClass(titleEl, true);
    }
    isSelection = !isSelection;
  });
  document.addEventListener("selectedChanged", () => {
    if (SelectionStore.vars.selected.props == props) return;
    toggleActiveCSSClass(titleEl, false);
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
 * Add event handling to category node
 *
 * @param {HTMLElement} titleEl Node text element (icon parent)
 * @param {HTMLElement} visibilityEl Node icon element
 * @param {Integer} modelIdx
 * @param {String} levelName
 * @param {String} categoryName
 */
function processCategoryNodeEvents(
  titleEl,
  visibilityEl,
  modelIdx,
  levelName,
  categoryName
) {
  let isEnabled = true;
  const model = Models.models[modelIdx];
  const level = model.levels.find((x) => x.name == levelName);
  const categoryInLevel = level.categories.find((x) => x.name == categoryName);
  const objectIDs = categoryInLevel.ids;

  visibilityEl.addEventListener("click", (e) => {
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

    handleMainSubset(objectIDs, modelIdx, isEnabled);
  });

  handleHighlighting(titleEl, modelIdx, objectIDs);
}

/**
 * Add event handling to level node
 *
 * @param {HTMLElement} titleEl Node text element (icon parent)
 * @param {HTMLElement} visibilityEl Node icon element
 * @param {Integer} modelIdx store index of model to be manipulated
 */
function processLevelEvents(titleEl, visibilityEl, modelIdx, levelName) {
  let isEnabled = true;
  const model = Models.models[modelIdx];
  const objectIDs = model.getIDsByLevelName(levelName);

  visibilityEl.addEventListener("click", (e) => {
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

    handleMainSubset(objectIDs, modelIdx, isEnabled);
  });

  handleHighlighting(titleEl, modelIdx, objectIDs);
}

/**
 * Add event handling to building node
 *
 * @param {HTMLElement} titleEl Node text element (icon parent)
 * @param {HTMLElement} visibilityEl Node icon element
 * @param {Integer} modelIdx store index of model to be manipulated
 */
function processBuildingEvents(titleEl, visibilityEl, modelIdx) {
  const model = Models.models[modelIdx];
  const objectIDs = model.getAllIDs();

  let isEnabled = true;
  visibilityEl.addEventListener("click", (e) => {
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

    handleMainSubset(objectIDs, modelIdx, isEnabled);
  });

  handleHighlighting(titleEl, modelIdx, objectIDs);
}

/**
 * Enables/disables subset on the scene, depending on "isEnabled"
 * @param {Array.<Integer>} expressIDs object expressID
 * @param {Integer} modelIdx identifies which model to manipulate
 * @param {Boolean} isEnabled
 */
function handleMainSubset(expressIDs, modelIdx, isEnabled) {
  if (isEnabled) SubsetBuilder.addToSubset(modelIdx, expressIDs);
  else SubsetBuilder.removeFromSubset(modelIdx, expressIDs);
}

function handleHighlighting(titleEl, modelIdx, objectIDs) {
  titleEl.addEventListener("mouseenter", () => {
    SelectionStore.setHighlightedProperties("fake props", objectIDs, modelIdx, false);
    
  });

  titleEl.addEventListener("mouseleave", () => {
    
  });
}

export {
  processLeafNodeEvents,
  processCategoryNodeEvents,
  processLevelEvents,
  processBuildingEvents,
};
