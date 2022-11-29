import { createSubset, removeSubset } from "../../helpers/subsetBuilder";
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
    /* Code for only 1 object selected at a time

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
    const IdArr = storedObj.ids;

    */

    for (const modelIdx in storedObj.objects) {
      const idsToHighlight = storedObj.objects[modelIdx];
      const model = Models.models[modelIdx];
      createSubset(model, idsToHighlight, type);
    }
  } else {
    // if there's no selection, remove all selections
    for (let idx = 0; idx < Models.models.length; idx++) {
      const model = Models.models[idx];
      removeSubset(model, type);
    }
  }
}
