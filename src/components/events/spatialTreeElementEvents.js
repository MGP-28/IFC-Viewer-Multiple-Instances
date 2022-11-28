import { emitCustomGlobalEvent } from "../../helpers/emitEvent";
import * as SubsetBuilder from "../../helpers/subsetBuilder";
import * as Models from "../../stores/models";
import * as SelectionStore from "../../stores/selection";
import { isArrayEqual, isArrayPartOfArray } from "../../validators/arrays";

async function processLeafNodeEvents(titleEl, icons, expressID, modelIdx) {
  const objectIDs = [expressID];
  handleEvents(titleEl, icons, objectIDs, modelIdx);
}

async function processCategoryNodeEvents(
  titleEl,
  icons,
  modelIdx,
  levelName,
  categoryName
) {
  const model = Models.models[modelIdx];
  const level = model.levels.find((x) => x.name == levelName);
  const categoryInLevel = level.categories.find((x) => x.name == categoryName);
  const objectIDs = categoryInLevel.ids;

  handleEvents(titleEl, icons, objectIDs, modelIdx);
}

async function processLevelEvents(titleEl, icons, modelIdx, levelName) {
  const model = Models.models[modelIdx];
  const objectIDs = model.getIDsByLevelName(levelName);

  handleEvents(titleEl, icons, objectIDs, modelIdx);
}

async function processBuildingEvents(titleEl, icons, modelIdx) {
  const model = Models.models[modelIdx];
  const objectIDs = model.getAllIDs();
  SelectionStore.addNewModelReferenceToVisible(modelIdx);
  SelectionStore.addIdsToVisible(objectIDs, modelIdx);

  handleEvents(titleEl, icons, objectIDs, modelIdx);
}

// #region aux functions

function toggleActiveCSSClass(title, isActive) {
  if (isActive) title.classList.add("anim-gradient");
  else title.classList.remove("anim-gradient");
  return false;
}

async function handleEvents(titleEl, icons, objectIDs, modelIdx) {
  let isEnabled = true;
  handleVisibility(icons, objectIDs, modelIdx, isEnabled);

  let isSelection = false;
  await handleSelection(
    icons.selection,
    objectIDs,
    modelIdx,
    isSelection,
    titleEl
  );

  handleHighlighting(titleEl, objectIDs, modelIdx);

  handleIsolation(icons, objectIDs, modelIdx, isEnabled);
}

/**
 * Enables/disables subset on the scene, depending on "isEnabled"
 * @param {Array.<Integer>} expressIDs object expressID
 * @param {Integer} modelIdx identifies which model to manipulate
 * @param {Boolean} isEnabled
 */
function handleMainSubset(expressIDs, modelIdx, isEnabled) {
  if (isEnabled) {
    SubsetBuilder.addToSubset(modelIdx, expressIDs);
    SelectionStore.addIdsToVisible(modelIdx, expressIDs)
  }
  else {
    SubsetBuilder.removeFromSubset(modelIdx, expressIDs);
    SelectionStore.removeIdsFromVisible(modelIdx, expressIDs)
  }
}

function handleHighlighting(titleEl, objectIDs, modelIdx) {
  titleEl.addEventListener("mouseenter", () => {
    SelectionStore.setHighlightedProperties(
      "fake props",
      objectIDs,
      modelIdx,
      false
    );
  });

  titleEl.addEventListener("mouseleave", () => {
    SelectionStore.resetHighlightedProperties();
  });
}

function handleVisibility(icons, objectIDs, modelIdx, isEnabled) {
  // (listener, self) click => show/hide self
  icons.visibility.addEventListener("click", (e) => {
    e.stopPropagation();

    isEnabled = !isEnabled;
    // if (isEnabled) SelectionStore.addIdsToVisible(objectIDs, modelIdx);
    // else SelectionStore.removeIdsFromVisible(modelIdx, objectIDs);

    handleMainSubset(objectIDs, modelIdx, isEnabled);

    toggleVisibilityIcon(icons.visibility, isEnabled);
  });

  document.addEventListener("visibilityChanged", (e) => {
    coordinateVisibility(icons, objectIDs, modelIdx, isEnabled);
  });
}

async function handleSelection(
  selectionEl,
  objectIDs,
  modelIdx,
  isSelection,
  titleEl
) {
  const model = Models.models[modelIdx];
  const loader = model.loader;
  const props =
    objectIDs.length == 1
      ? await loader.ifcManager.getItemProperties(0, objectIDs[0], true)
      : "fake props";

  selectionEl.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isSelection) {
      SelectionStore.resetSelectedProperties();
      toggleActiveCSSClass(titleEl, false);
    } else {
      SelectionStore.setSelectedProperties(props, objectIDs, modelIdx, false);
      toggleActiveCSSClass(titleEl, true);
    }
    isSelection = !isSelection;
  });

  document.addEventListener("selectedChanged", () => {
    const selected = SelectionStore.vars.selected;
    if (selected.isValid() && isArrayEqual(selected.ids, objectIDs)) return;
    isSelection = false;
    toggleActiveCSSClass(titleEl, isSelection);
  });
}

function handleIsolation(icons, objectIDs, modelIdx, isEnabled) {
  icons.isolation.addEventListener("click", (e) => {
    e.stopPropagation();

    isEnabled = true;

    const model = Models.models[modelIdx];
    model.subset.removeFromParent();
    handleMainSubset(objectIDs, modelIdx, isEnabled);
  });

  document.addEventListener("visibilityChanged", (e) => {
    coordinateVisibility(icons, objectIDs, modelIdx, isEnabled);
  });
}

function toggleVisibilityIcon(visibilityEl, isEnabled) {
  const icon = visibilityEl.childNodes[0];
  if (isEnabled) icon.src = icon.src.replace("eye-off.svg", "eye.svg");
  else icon.src = icon.src.replace("eye.svg", "eye-off.svg");
}

function coordinateVisibility(icons, objectIDs, modelIdx, isEnabled) {
  let isPart = false;
  isEnabled = false;
  for (let idx = 0; idx < objectIDs.length; idx++) {
    const element = objectIDs[idx];
    isPart = SelectionStore.isVisible(modelIdx, element);
    if(isPart) {
      isEnabled = true;
      break;
    }
  }

  // if (isArrayEqual(ids, objectIDs)) isPart = true;
  // else isPart = isArrayPartOfArray(objectIDs, ids);

  // if (isPart) isEnabled = true;
  // else isEnabled = false;

  toggleVisibilityIcon(icons.visibility, isEnabled);
}

// #endregion aux functions

export {
  processLeafNodeEvents,
  processCategoryNodeEvents,
  processLevelEvents,
  processBuildingEvents,
};
