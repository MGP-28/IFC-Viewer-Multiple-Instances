import * as ModelStore from "../stores/models";
import * as SelectionStore from "../stores/selection";
import * as SubsetBuilder from "./subsetBuilder";

function renderAllObjects() {
  for (let modelIdx = 0; modelIdx < ModelStore.models.length; modelIdx++) {
    const model = ModelStore.models[modelIdx];
    // render all objects
    const allObjectIDs = model.getAllIDs();

    SelectionStore.addIdsToVisible(modelIdx, allObjectIDs);
    SubsetBuilder.addToSubset(modelIdx, allObjectIDs);
  }
}

export { renderAllObjects }