import * as ClippingPlanesStore from "../stores/clippingPlanes";
import { removeActiveId, savedViews, setActiveId } from "../stores/savedViews";
import { setCameraData } from "./camera";
import { updatePlanesPositions } from "./clippingPlanes";

function loadView(id) {
  if (savedViews.length == 0) return;

  const savedView = savedViews.find((x) => (x.id == id));

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
}

function resetView(){
  removeActiveId();

  ClippingPlanesStore.edgePositions.currentMin = ClippingPlanesStore.edgePositions.min.clone();
  ClippingPlanesStore.edgePositions.currentMax = ClippingPlanesStore.edgePositions.max.clone();
  if (ClippingPlanesStore.visualPlanes.length > 0) updatePlanesPositions();
}

export { loadView, resetView };