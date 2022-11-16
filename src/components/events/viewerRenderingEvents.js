import { createSubset, removeSubset } from "../../helpers/buildSubset.js";
import * as Models from "../../stores/models.js";
import * as RaycastStore from "../../stores/raycast.js";

export default function startRenderingEvents() {
  document.addEventListener("selectedChanged", (event) => {
    if (RaycastStore.isFoundValid()) {
      // get selected model index in Store array
      const modelIdx = RaycastStore.found.idx;

      // get all not selected models and remove any selection subsets on them
      const otherModels = Models.models.filter(
        (value, index) => index !== modelIdx
      );
      otherModels.forEach((model) => {
        removeSubset(model, "selected");
      });

      // add selection subset to the selected model
      const model = Models.models[modelIdx];
      const IdArr = [Models.selectedProperties.expressID];
      createSubset(model, IdArr, "selected");
    } else {
      // if there's no selection, remove all selections
      for (let idx = 0; idx < Models.models.length; idx++) {
        const model = Models.models[idx];
        removeSubset(model, "selected");
      }
    }
  });
}
