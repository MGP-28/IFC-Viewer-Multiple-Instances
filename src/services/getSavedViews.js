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
      savedView.hiddenIds = element.hiddenIds;

      results.push(savedView);
    });
    return results;
  }
  return null;
}

export { getSavedViews };
