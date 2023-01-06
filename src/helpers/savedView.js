import * as ClippingPlanesStore from "../stores/clippingPlanes";
import * as ModelStore from "../stores/models";
import { removeActiveId, savedViews, setActiveId } from "../stores/savedViews";
import * as SelectionStore from "../stores/selection";
import { setCameraData } from "./camera";
import { updatePlanesPositions } from "./clippingPlanes";
import { renderAllObjects } from "./rendering";
import * as SubsetBuilder from "./subsetBuilder";

function loadView(id) {
  if (savedViews.length == 0) return;

  const savedView = savedViews.find((x) => x.id == id);

  if (!savedView) {
    console.error("invalid saved view");
    return;
  }

  setActiveId(id);

  // set camera
  setCameraData(savedView);
  ClippingPlanesStore.edgePositions.currentMin = savedView.clipping.min.clone();
  ClippingPlanesStore.edgePositions.currentMax = savedView.clipping.max.clone();
  if (ClippingPlanesStore.visualPlanes.length > 0) updatePlanesPositions();

  // set objects
  const hiddenIdsByModel = savedView.hiddenIds;

  // render all objects
  renderAllObjects();

  for (const modelIdx in hiddenIdsByModel) {
    if (!Object.hasOwnProperty.call(hiddenIdsByModel, modelIdx)) continue;

    // remove hidden objects from scene
    const hiddenIds = hiddenIdsByModel[modelIdx];

    SelectionStore.removeIdsFromVisible(modelIdx, hiddenIds);
    SubsetBuilder.removeFromSubset(modelIdx, hiddenIds);
  }
}

function resetView() {
  removeActiveId();

  ClippingPlanesStore.edgePositions.currentMin =
    ClippingPlanesStore.edgePositions.min.clone();
  ClippingPlanesStore.edgePositions.currentMax =
    ClippingPlanesStore.edgePositions.max.clone();
  if (ClippingPlanesStore.visualPlanes.length > 0) updatePlanesPositions();
}

export { loadView, resetView };
