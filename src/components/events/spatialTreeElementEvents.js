import * as SubsetBuilder from "../../helpers/subsetBuilder";
import * as Models from "../../stores/models";
import * as SelectionStore from "../../stores/selection";

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
  SelectionStore.addIdsToVisible(modelIdx, objectIDs);

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
  handleVisibility(icons, objectIDs, modelIdx);

  let isSelection = false;
  await handleSelection(icons.selection, objectIDs, modelIdx, titleEl);

  handleHighlighting(titleEl, objectIDs, modelIdx);

  handleIsolation(icons, objectIDs, modelIdx);

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

  function handleVisibility(icons, objectIDs, modelIdx) {
    // (listener, self) click => show/hide self
    icons.visibility.addEventListener("click", (e) => {
      e.stopPropagation();

      isEnabled = !isEnabled;

      handleMainSubset(objectIDs, modelIdx, isEnabled);
    });

    document.addEventListener("visibilityChanged", (e) => {
      coordinateVisibility(icons, objectIDs, modelIdx, isEnabled);
    });
  }

  async function handleSelection(selectionEl, objectIDs, modelIdx, titleEl) {
    const isLeaf = objectIDs.length == 1;
    const model = Models.models[modelIdx];
    const loader = model.loader;
    const props = isLeaf
      ? await loader.ifcManager.getItemProperties(0, objectIDs[0], true)
      : "fake props";

    const eventEl = isLeaf ? titleEl : selectionEl;

    eventEl.addEventListener("click", (e) => {
      e.stopPropagation();
      isSelection = !isSelection;
      if (!isSelection) SelectionStore.resetSelectedProperties();
      else
        SelectionStore.setSelectedProperties(props, objectIDs, modelIdx, false);
    });

    document.addEventListener("selectedChanged", () => {
      const selected = SelectionStore.vars.selected;

      let isInSelection = false;
      for (let idx = 0; idx < objectIDs.length; idx++) {
        const expressID = objectIDs[idx];
        if (selected.includesObjectByID(modelIdx, expressID)) {
          isInSelection = true;
          break;
        }
      }
      isSelection = selected.isValid() && isInSelection;
      toggleActiveCSSClass(titleEl, isSelection);
    });
  }

  function handleIsolation(icons, objectIDs, modelIdx) {
    icons.isolation.addEventListener("click", (e) => {
      e.stopPropagation();

      isEnabled = true;

      const model = Models.models[modelIdx];
      model.subset.removeFromParent();
      handleMainSubset(objectIDs, modelIdx);
    });
  }

  function toggleVisibilityIcon(visibilityEl) {
    const icon = visibilityEl.childNodes[0];
    if (isEnabled) icon.src = icon.src.replace("eye-off.svg", "eye.svg");
    else icon.src = icon.src.replace("eye.svg", "eye-off.svg");
  }

  function coordinateVisibility(icons, objectIDs, modelIdx) {
    isEnabled = false;
    for (let idx = 0; idx < objectIDs.length; idx++) {
      const element = objectIDs[idx];
      if (SelectionStore.isVisible(modelIdx, element)) {
        isEnabled = true;
        break;
      }
    }
    toggleVisibilityIcon(icons.visibility, isEnabled);
  }

  /**
   * Enables/disables subset on the scene, depending on "isEnabled"
   * @param {Array.<Integer>} expressIDs object expressID
   * @param {Integer} modelIdx identifies which model to manipulate
   */
  function handleMainSubset(expressIDs, modelIdx) {
    if (isEnabled) {
      SubsetBuilder.addToSubset(modelIdx, expressIDs);
      SelectionStore.addIdsToVisible(modelIdx, expressIDs);
    } else {
      SubsetBuilder.removeFromSubset(modelIdx, expressIDs);
      SelectionStore.removeIdsFromVisible(modelIdx, expressIDs);
    }
  }
}

// #endregion aux functions

export {
  processLeafNodeEvents,
  processCategoryNodeEvents,
  processLevelEvents,
  processBuildingEvents,
};
