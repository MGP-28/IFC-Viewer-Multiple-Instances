import SavedView from "../models/SavedView";
import { loadFromLS } from "./localStorage";
import { convertJSONToVector } from "../helpers/generic/vectors";

function getSavedViews() {
  const LSData = loadFromLS("savedViews");
  if (LSData) {
    const results = [];
    LSData.forEach((element) => {
      const savedView = new SavedView();
      savedView.camera.position = convertJSONToVector(
        element.camera.position
      ).clone();
      savedView.camera.pointLookedAt = convertJSONToVector(
        element.camera.pointLookedAt
      ).clone();
      savedView.clipping.min = convertJSONToVector(
        element.clipping.min
      ).clone();
      savedView.clipping.max = convertJSONToVector(
        element.clipping.max
      ).clone();
      savedView.id = element.id;
      savedView.note = element.note;

      // parse values to Int (issue with them being strings and not functioning correctly)
      for (const modelIdx in element.hiddenIds) {
        if (Object.hasOwnProperty.call(element.hiddenIds, modelIdx)) {
          const _hiddenIds = element.hiddenIds[modelIdx];
          const hiddenIds = _hiddenIds.reduce((pV, cV) => {
            const num = parseInt(cV);
            pV.push(num);
            return pV;
          }, []);
          element.hiddenIds[modelIdx] = hiddenIds;
        }
      }
      savedView.hiddenIds = element.hiddenIds;

      results.push(savedView);
    });
    return results;
  }
  return null;
}

export { getSavedViews };
