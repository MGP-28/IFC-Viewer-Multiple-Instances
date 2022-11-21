import { selectedFeatureTabIdx } from "../../stores/selection";
import startGroupSelection from "./groupSelection";
import startSpatialTree from "./spatialTree";

class Feature {
  constructor(name, element) {
    this.name = name;
    this.element = element;
  }
}

let idx = 0;
const features = [];

export default async function featureContent() {
  const spatialTree = await startSpatialTree();
  spatialTree.classList.remove("hidden");
  processContentTab("Spatial Trees", spatialTree);

  const groupSelection = startGroupSelection();
  processContentTab("Group Selection", groupSelection);

  return features;
}

function processContentTab(name, element) {
  eventChangeTab(element, idx);
  const feature = new Feature(name, element);
  features.push(feature);
  idx++;
}

function eventChangeTab(element, currentIdx) {
  document.addEventListener("featureSelected", () => {
    if (currentIdx === selectedFeatureTabIdx) element.classList.remove("hidden");
    else element.classList.add("hidden");
  });
}
