import startInput from "./fileInput.js";
import startUserInputs from "./events/userInputs.js";
import startObjectDetail from "./objectDetail.js";
import startRenderingEvents from "./events/viewerRenderingEvents.js";
import startSpatialTree from "./spatialTree.js";
import startLoadingPopup from "./loading.js";

export default function render() {
  startLoadingPopup();
  startInput();
  startUserInputs();
  startRenderingEvents();
  startObjectDetail();
  startSpatialTree();
}
