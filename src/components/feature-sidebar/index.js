import * as SelectionStore from "../../stores/selection";
import featureTab from "./tab";
import featureContent from "./content";

export default async function startFeatureSidebar() {
  // wrapper
  const featureContainer = document.createElement("div");
  featureContainer.classList.add("feature-container", "hidden");
  
  document.addEventListener("featuresCompleted", () => {
    featureContainer.classList.remove("hidden");
  });

  // content + tabs
  const featureList = await featureContent();

  const featureTabs = document.createElement("div");
  featureTabs.classList.add("feature-tabs-container");

  const featureContentEl = document.createElement("div");
  featureContentEl.classList.add("feature-content-container");

  for (let idx = 0; idx < featureList.length; idx++) {
    const feature = featureList[idx];
    const tab = featureTab(feature.name, idx);
    featureTabs.appendChild(tab);
    featureContentEl.appendChild(feature.element);
  }

  // appending
  featureContainer.appendChild(featureTabs);
  featureContainer.appendChild(featureContentEl);

  document.body.appendChild(featureContainer);

  // Initialize a tab and content
  SelectionStore.setSelectedFeatureTabIdx(0);
}
