import { createSubset, removeSubset } from "../../helpers/buildSubset.js";
import * as Models from "../../stores/models.js";
import * as SelectedStore from "../../stores/selection.js";

export default function startRenderingEvents() {
  document.addEventListener("selectedChanged", (event) => {
    processRenderization("selected");
  });

  document.addEventListener("highlightedChanged", (event) => {
    processRenderization("highlighted");
  });
}

// Handles renderization of subsets in the viewer
// @type (string) = material type, according to src/configs/materials.js
function processRenderization(type) {
  const storedObj = SelectedStore.vars[type];

  if (storedObj.isValid()) {
    // get selected model index in Store array
    const modelIdx = storedObj.modelIdx;

    // get all not selected models and remove any selection subsets on them
    const otherModels = Models.models.filter(
      (value, index) => index !== modelIdx
    );
    otherModels.forEach((model) => {
      removeSubset(model, type);
    });

    // add selection subset to the selected model
    const model = Models.models[modelIdx];
    const IdArr = [storedObj.props.expressID];

    createSubset(model, IdArr, type);
  } else {
    if (!SelectedStore.isSelectionFromViewer) return;
    // if there's no selection, remove all selections
    for (let idx = 0; idx < Models.models.length; idx++) {
      const model = Models.models[idx];
      removeSubset(model, type);
    }
  }
}
