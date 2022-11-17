import emitGlobalEvent from "../helpers/emitEvent";

// Currently selected object's properties
let selectedProperties = undefined;
/**
 * 
 * @param {Object} props selected object properties
 * @param {boolean} isSelection is user selection the object or just highlighting
 * @param {boolean} isFromViewer is user interacting with the 3D model. If false, menus are being used to manipulate the model
 */
const setSelectedProperties = (props, isSelection, isFromViewer) => {
  selectedProperties = props;
  if (isSelection) emitGlobalEvent("selectedChanged");
  else emitGlobalEvent("highlightedChanged");
  isSelectionFromViewer = isFromViewer;
};

let isSelectionFromViewer = true;

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
  selectedProperties,
  setSelectedProperties,
  selectedSpatialTreeIdx,
  setselectedSpatialTree,
  isSelectionFromViewer
};
