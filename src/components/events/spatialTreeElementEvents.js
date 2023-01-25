import * as SubsetBuilder from "../../helpers/subsetBuilder";
import * as Models from "../../stores/models";
import * as SelectionStore from "../../stores/selection";

async function processNodeEvents(titleEl, icons, node) {
  const objectsData = getAllObjectsDataByModel(node);
  handleEvents(titleEl, icons, objectsData, node);
}

// #region aux functions

function getAllObjectsDataByModel(node) {
  const data = getAllObjectsData(node); // [ { expressId, modelIdx }, ... ]
  let objectsData = [];
  for (let idx = 0; idx < data.length; idx++) {
    const singleObjectData = data[idx];
    const modelIdx = singleObjectData.modelIdx;
    // create array if it doesn't exist
    let _modelIdx = objectsData.findIndex((x) => x.modelIdx == modelIdx);
    if (_modelIdx == -1) {
      objectsData.push({
        modelIdx: modelIdx,
        expressIDs: [],
      });
      _modelIdx = objectsData.length - 1;
    }
    objectsData[_modelIdx].expressIDs.push(singleObjectData.expressId);
  }
  return objectsData;
}

function getAllObjectsData(node) {
  let data = [];
  if (!node.children) {
    const { expressId, modelIdx } = node;
    data.push({ expressId, modelIdx });
    return data;
  }
  node.children.forEach((childNode) => {
    data = data.concat(getAllObjectsData(childNode));
  });
  return data;
}

function toggleActiveCSSClass(title, isActive) {
  if (isActive) title.classList.add("anim-gradient");
  else title.classList.remove("anim-gradient");
  return false;
}

/**
 *
 * @param {HTMLElement} titleEl
 * @param {HTMLElement[]} icons
 * @param {Object[]} objectsData Array of {expressId, modelIdx}
 */
async function handleEvents(titleEl, icons, objectsData, node) {
  let isEnabled = true;
  handleVisibility(icons, objectsData);

  let isSelection = false;
  await handleSelection(icons.selection, objectsData, titleEl, node);

  handleHighlighting(titleEl, objectsData);

  handleIsolation(icons, objectsData);

  function handleHighlighting(titleEl, objectsData) {
    titleEl.addEventListener("mouseenter", () => {
      SelectionStore.setHighlightedProperties("fake props", objectsData, false);
    });

    titleEl.addEventListener("mouseleave", () => {
      SelectionStore.resetHighlightedProperties();
    });
  }

  function handleVisibility(icons, objectsData) {
    // (listener, self) click => show/hide self
    icons.visibility.addEventListener("click", (e) => {
      e.stopPropagation();

      isEnabled = !isEnabled;

      handleMainSubset(objectsData, isEnabled);
    });

    document.addEventListener("visibilityChanged", (e) => {
      coordinateVisibility(icons, objectsData);
    });
  }

  async function handleSelection(selectionEl, objectsData, titleEl, node) {
    const isLeaf = !node.children;
    const eventEls = isLeaf ? [titleEl, selectionEl] : [selectionEl];

    eventEls.forEach((eventEl) => {
      eventEl.addEventListener("click", async (e) => {
        e.stopPropagation();
        isSelection = !isSelection;
        if (!isSelection) SelectionStore.resetSelectedProperties();
        else {
          const props = isLeaf ? await getProps(objectsData[0]) : "fake props";
          SelectionStore.setSelectedProperties(props, objectsData, false);
        }
      });
    });

    document.addEventListener("selectedChanged", () => {
      const selected = SelectionStore.vars.selected;

      let isInSelection = false;
      for (let idx = 0; idx < objectsData.length; idx++) {
        const objectsDataByModel = objectsData[idx];
        for (let idx2 = 0; idx2 < objectsDataByModel.expressIDs.length; idx2++) {
          const expressID = objectsDataByModel.expressIDs[idx2];
          if (selected.includesObjectByID(objectsDataByModel.modelIdx, expressID)) {
            isInSelection = true;
            break;
          }
        }
        if (isInSelection) break;
      }
      isSelection = selected.isValid() && isInSelection;
      toggleActiveCSSClass(titleEl, isSelection);
    });

    /**
     *
     * @param {Object} objectData {modelIdx, expressId}
     * @returns
     */
    async function getProps(objectData) {
      const { modelIdx } = objectData;
      const expressId = objectData.expressIDs[0];
      const model = Models.models[modelIdx];
      const loader = model.loader;
      return await loader.ifcManager.getItemProperties(0, expressId, true);
    }
  }

  function handleIsolation(icons, objectsData) {
    icons.isolation.addEventListener("click", (e) => {
      e.stopPropagation();

      // Removes all objects from each model subsets
      for (let idx = 0; idx < Models.models.length; idx++) {
        const modelIds = Models.models[idx].getAllIDs();
        SubsetBuilder.removeFromSubset(idx, modelIds);
      }

      // Turns off all object references
      SelectionStore.resetVisible();

      // Enables only the selected objects
      isEnabled = true;
      handleMainSubset(objectsData, isEnabled);
    });
  }

  function toggleVisibilityIcon(visibilityEl) {
    const icon = visibilityEl.childNodes[0];
    if (isEnabled) icon.src = icon.src.replace("eye-off.svg", "eye.svg");
    else icon.src = icon.src.replace("eye.svg", "eye-off.svg");
  }

  function coordinateVisibility(icons, objectsData) {
    isEnabled = false;
    for (let idx = 0; idx < objectsData.length; idx++) {
      const modelIdx = objectsData[idx].modelIdx;
      const expressIDs = objectsData[idx].expressIDs;
      for (let idx2 = 0; idx2 < expressIDs.length; idx2++) {
        const expressID = expressIDs[idx2];
        if (SelectionStore.isVisible(modelIdx, expressID)) {
          isEnabled = true;
          break;
        }
      }
      if (isEnabled) break;
    }
    toggleVisibilityIcon(icons.visibility);
  }

  /**
   * Enables/disables subset on the scene, depending on "isEnabled"
   * @param {Array.<Integer>} expressIDs object expressID
   * @param {Integer} modelIdx identifies which model to manipulate
   */
  function handleMainSubset(objectsData, isEnabled) {
    for (let idx = 0; idx < objectsData.length; idx++) {
      const modelIdx = objectsData[idx].modelIdx;
      const expressIDs = objectsData[idx].expressIDs;
      if (isEnabled) {
        SubsetBuilder.addToSubset(modelIdx, expressIDs);
        SelectionStore.addIdsToVisible(modelIdx, expressIDs);
      } else {
        SubsetBuilder.removeFromSubset(modelIdx, expressIDs);
        SelectionStore.removeIdsFromVisible(modelIdx, expressIDs);
      }
    }
  }
}

// #endregion aux functions

export { processNodeEvents };
