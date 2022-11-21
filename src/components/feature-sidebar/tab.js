import * as SelectionStore from "../../stores/selection";

export default function featureTab(text, idx){
    const tab = document.createElement("div");
    tab.classList.add("feature-tab");
    tab.textContent = text;
    tab.addEventListener("click", () => {
        SelectionStore.setSelectedFeatureTabIdx(idx);
    })
    document.addEventListener("featureSelected", () => {
        if (SelectionStore.selectedFeatureTabIdx == idx)
        tab.classList.add("tab-active");
        else tab.classList.remove("tab-active");
      });
    return tab;
}