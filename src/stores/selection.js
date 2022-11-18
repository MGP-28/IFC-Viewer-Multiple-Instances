import emitGlobalEvent from "../helpers/emitEvent";
import Selected from "../models/Selected";

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
const setSelectedProperties = (props, modelIdx, isFromViewer) => {
  vars.selected.addProps(props, modelIdx);
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
const setHighlightedProperties = (props, modelIdx, isFromViewer) => {
  vars.highlighted.addProps(props, modelIdx);
  isSelectionFromViewer = isFromViewer;
  emitGlobalEvent("highlightedChanged");
};

const resetHighlightedProperties = () => {
  vars.highlighted.reset();
  isSelectionFromViewer = true;
  emitGlobalEvent("highlightedChanged");
};

let selectedSpatialTreeIdx = undefined;
/**
 * Sets selected tree's model index
 * @param {int} index model index on Stores/models.js
 */
const setselectedSpatialTree = (index) => {
  selectedSpatialTreeIdx = index;
  emitGlobalEvent("spatialTreeSelected");
};

export {
  vars,
  setSelectedProperties,
  resetSelectedProperties,
  setHighlightedProperties,
  resetHighlightedProperties,
  isSelectionFromViewer,
  selectedSpatialTreeIdx,
  setselectedSpatialTree,
};
