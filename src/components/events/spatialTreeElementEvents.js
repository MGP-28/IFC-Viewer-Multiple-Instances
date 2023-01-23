import * as SubsetBuilder from "../../helpers/subsetBuilder";
import * as Models from "../../stores/models";
import * as SelectionStore from "../../stores/selection";

async function processNodeEvents(titleEl, icons, node) {
  const objectsData = getAllObjectsDataByModel(node);
  handleEvents(titleEl, icons, objectsData);
}

// #region aux functions

function getAllObjectsDataByModel(node) {
  const data = getAllObjectsData(node);
  let objectsData = {};
  for (let idx = 0; idx < data.length; idx++) {
    const singleObjectData = data[idx];
    const modelIdx = singleObjectData.modelIdx;
    // create array if it doesn't exist
    if (!objectsData[modelIdx]) objectsData[modelIdx] = [];
    objectsData[modelIdx].push(singleObjectData);
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
async function handleEvents(titleEl, icons, objectsData) {
  let isEnabled = true;
  handleVisibility(icons, objectsData);

  let isSelection = false;
  await handleSelection(icons.selection, objectsData, titleEl);

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

      for (const modelIdx in objectsData) {
        if (Object.hasOwnProperty.call(objectsData, modelIdx)) {
          const objectDataByModel = objectsData[modelIdx];
          handleMainSubset(objectDataByModel, isEnabled);
        }
      }
    });

    document.addEventListener("visibilityChanged", (e) => {
      for (const modelIdx in objectsData) {
        if (Object.hasOwnProperty.call(objectsData, modelIdx)) {
          const objectDataByModel = objectsData[modelIdx];
          coordinateVisibility(icons, objectDataByModel, isEnabled);
        }
      }
    });
  }

  async function handleSelection(selectionEl, objectsData, titleEl) {
    const objectsArr = Object.keys(objectsData).reduce((acc, cv) => acc.concat(objectsData[cv]), []);
    // console.log("objectsDataJoinValues", objectsArr);
    const isLeaf = objectsArr.length == 1;
    const props = isLeaf ? await getProps(objectsArr[0]) : "fake props";

    const eventEls = isLeaf ? [titleEl, selectionEl] : [selectionEl];

    eventEls.forEach((eventEl) => {
      eventEl.addEventListener("click", (e) => {
        e.stopPropagation();
        isSelection = !isSelection;
        if (!isSelection) SelectionStore.resetSelectedProperties();
        else SelectionStore.setSelectedProperties(props, objectsData, false);
      });
    });

    document.addEventListener("selectedChanged", () => {
      const selected = SelectionStore.vars.selected;

      let isInSelection = false;
      for (const modelIdx in objectsData) {
        if (Object.hasOwnProperty.call(objectsData, modelIdx)) {
          const expressIDsByModel = objectsData[modelIdx];
          for (let idx = 0; idx < expressIDsByModel.length; idx++) {
            const expressID = expressIDsByModel[idx];
            if (selected.includesObjectByID(modelIdx, expressID)) {
              isInSelection = true;
              break;
            }
          }
        }
        if(isInSelection) break;
      }
      isSelection = selected.isValid() && isInSelection;
      toggleActiveCSSClass(titleEl, isSelection);
    });

    async function getProps(objectData) {
      const modelIdx = objectData.modelIdx;
      const model = Models.models[modelIdx];
      const loader = model.loader;
      const expressID = objectData.expressId;
      return await loader.ifcManager.getItemProperties(0, expressID, true);
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
    for (const modelIdx in objectsData) {
      if (Object.hasOwnProperty.call(objectsData, modelIdx)) {
        const expressIDsByModel = objectsData[modelIdx];
        for (let idx = 0; idx < expressIDsByModel.length; idx++) {
          const expressID = expressIDsByModel[modelIdx];
          if (SelectionStore.isVisible(modelIdx, expressID)) {
            isEnabled = true;
            break;
          }
        }
        toggleVisibilityIcon(icons.visibility, isEnabled);
      }
    }
  }

  /**
   * Enables/disables subset on the scene, depending on "isEnabled"
   * @param {Array.<Integer>} expressIDs object expressID
   * @param {Integer} modelIdx identifies which model to manipulate
   */
  function handleMainSubset(objectsData, isEnabled) {
    for (const modelIdx in objectsData) {
      if (Object.hasOwnProperty.call(objectsData, modelIdx)) {
        const expressIDsByModel = objectsData[modelIdx];
        if (isEnabled) {
          SubsetBuilder.addToSubset(modelIdx, expressIDsByModel);
          SelectionStore.addIdsToVisible(modelIdx, expressIDsByModel);
        } else {
          SubsetBuilder.removeFromSubset(modelIdx, expressIDsByModel);
          SelectionStore.removeIdsFromVisible(modelIdx, expressIDsByModel);
        }
      }
    }
  }
}

// #endregion aux functions

export { processNodeEvents };
