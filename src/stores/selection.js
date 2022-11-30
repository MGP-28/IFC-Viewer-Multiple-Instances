import { emitGlobalEvent } from "../helpers/emitEvent";
import Selected from "../models/Selected";

// Currently visible object's properties
let visibilityByIds = {};

const isVisible = (modelIdx, expressID) => {
  return visibilityByIds[modelIdx][expressID];
};

const addNewModelReferenceToVisible = (modelIdx) => {
  visibilityByIds[modelIdx] = {};
};

const addIdsToVisible = (modelIdx, ids) => {
  console.log(ids)
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
  console.log('reset')
  for (const modelIdx in visibilityByIds) {
    const visibleIdsByModel = visibilityByIds[modelIdx];
    console.log('model', visibleIdsByModel)
    for (const expressID in visibleIdsByModel) {
    // for (let expressID = 0; expressID < visibleIdsByModel.length; expressID++) {
      console.log('id', visibleIdsByModel[expressID])

      //////


      visibleIdsByModel[expressID] = false;
    }
  }
  // for (let modelIdx = 0; modelIdx < visibilityByIds.length; modelIdx++) {
  //   console.log('model')
  //   const visibleIdsByModel = visibilityByIds[modelIdx];
  //   for (let expressID = 0; expressID < visibleIdsByModel.length; expressID++) {
  //     console.log('id', visibleIdsByModel[expressID])
  //     visibleIdsByModel[expressID] = false;
  //   }
  // }
  emitGlobalEvent("visibilityChanged");
}

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
const setSelectedProperties = (props, ids, modelIdx, isFromViewer) => {
  vars.selected.reset();
  vars.selected.addProps(props, ids, modelIdx);
  isSelectionFromViewer = isFromViewer;
  emitGlobalEvent("selectedChanged");
};

const resetSelectedProperties = () => {
  vars.selected.reset();
  isSelectionFromViewer = true;
  emitGlobalEvent("selectedChanged");
};

let isSelectionFromViewer = true;

// Currently highlighted object's properties
/**
 *
 * @param {Object} props selected object properties
 * @param {int} modelIdx model instance index value
 * @param {boolean} isFromViewer is user interacting with the 3D model. If false, menus are being used to manipulate the model
 */
const setHighlightedProperties = (props, ids, modelIdx, isFromViewer) => {
  vars.highlighted.reset();
  vars.highlighted.addProps(props, ids, modelIdx);
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
};
