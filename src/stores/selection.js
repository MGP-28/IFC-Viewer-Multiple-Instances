import { emitGlobalEvent } from "../helpers/emitEvent";
import Selected from "../models/Selected";

// Currently visible object's properties
let visibilityByIds = {};

function getVisibilityByIds() {
  return visibilityByIds;
}

const isVisible = (modelIdx, expressID) => {
  return visibilityByIds[modelIdx][expressID];
};

const addNewModelReferenceToVisible = (modelIdx) => {
  visibilityByIds[modelIdx] = {};
};

const addIdsToVisible = (modelIdx, ids) => {
  for (let idx = 0; idx < ids.length; idx++) {
    const element = ids[idx];
    visibilityByIds[modelIdx][element] = true;
  }
  emitGlobalEvent("visibilityChanged");
};

const removeIdsFromVisible = (modelIdx, ids) => {
  for (let idx = 0; idx < ids.length; idx++) {
    const element = ids[idx];
    visibilityByIds[modelIdx][element] = false;
  }
  emitGlobalEvent("visibilityChanged");
};

const resetVisible = () => {
  for (const modelIdx in visibilityByIds) {
    const visibleIdsByModel = visibilityByIds[modelIdx];
    for (const expressID in visibleIdsByModel) {
      visibleIdsByModel[expressID] = false;
    }
  }
  emitGlobalEvent("visibilityChanged");
};

const vars = {
  selected: new Selected(),
  highlighted: new Selected(),
};
// Currently selected object's properties
/**
 *
 * @param {Object} props selected object properties
 * @param {int} modelIdx model instance index value
 * @param {boolean} isFromViewer is user interacting with the 3D model. If false, menus are being used to manipulate the model
 */
const setSelectedProperties = (props, objectsData, isFromViewer) => {
  vars.selected.reset();
  for (let idx = 0; idx < objectsData.length; idx++) {
    const modelIdx = objectsData[idx].modelIdx;
    const expressIDs = objectsData[idx].expressIDs;
    vars.selected.addProps(props, expressIDs, modelIdx);
  }
  isSelectionFromViewer = isFromViewer;
  emitGlobalEvent("selectedChangedPriority");
  setTimeout(() => {
    emitGlobalEvent("selectedChanged");
  }, 1);
};

const resetSelectedProperties = () => {
  vars.selected.reset();
  isSelectionFromViewer = true;
  emitGlobalEvent("selectedChangedPriority");
  setTimeout(() => {
    emitGlobalEvent("selectedChanged");
  }, 1);
};

let isSelectionFromViewer = true;

// Currently highlighted object's properties
/**
 *
 * @param {Object} props selected object properties
 * @param {int} modelIdx model instance index value
 * @param {boolean} isFromViewer is user interacting with the 3D model. If false, menus are being used to manipulate the model
 */
const setHighlightedProperties = (props, objectsData, isFromViewer) => {
  vars.highlighted.reset();
  for (let idx = 0; idx < objectsData.length; idx++) {
    const modelIdx = objectsData[idx].modelIdx;
    const expressIDs = objectsData[idx].expressIDs;
    vars.highlighted.addProps(props, expressIDs, modelIdx);
  }
  isSelectionFromViewer = isFromViewer;
  emitGlobalEvent("highlightedChanged");
};

const resetHighlightedProperties = () => {
  vars.highlighted.reset();
  isSelectionFromViewer = true;
  emitGlobalEvent("highlightedChanged");
};

export {
  vars,
  addNewModelReferenceToVisible,
  addIdsToVisible,
  removeIdsFromVisible,
  resetVisible,
  isVisible,
  setSelectedProperties,
  resetSelectedProperties,
  setHighlightedProperties,
  resetHighlightedProperties,
  isSelectionFromViewer,
  getVisibilityByIds,
};
