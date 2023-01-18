import { emitGlobalEvent } from "../../../helpers/emitEvent";
import { createElement } from "../../../helpers/generic/domElements";
import * as Models from "../../../stores/models";
import { objectsData } from "../../../stores/renderObjects";

async function render() {
  emitGlobalEvent("loading");

  const element = createElement("div", {
    classes: ["spatial-tree-byCategory"],
  });

  const objects = Array.from(objectsData); //[...objectsData];

  // Send data to be processed in web worker
  const worker = new Worker("/src/tools/workers/spatialTree/byCategory.js", { type: "module" });
  worker.postMessage(objects);
  worker.onerror = (event) => {
    console.log("There is an error with your worker!");
  };
  worker.onmessage = (e) => {
    const objectsByCategory = e.data;

    console.log("objectsByCategory", objectsByCategory);

    worker.terminate();
  };

  emitGlobalEvent("loadingComplete");

  return element;

  const model = Models.models[leaf.modelIdx];
  const props = await model.loader.ifcManager.getItemProperties(0, leaf.expressId);
  const psets = await model.loader.ifcManager.getPropertySets(0, leaf.expressId);

  for (let index1 = 0; index1 < psets.length; index1++) {
    const pset = psets[index1];
    if (!pset.HasProperties) continue;
    for (let index = 0; index < pset.HasProperties.length; index++) {
      const prop = pset.HasProperties[index];
      if (!prop.value) continue;
      const cc = await model.loader.ifcManager.getItemProperties(0, prop.value);
      console.log("related to", leaf.expressId, cc);
    }
  }
}

function sortObjectsByCategory(a, b) {
  // Compare the 2 dates
  if (a.category < b.category) return -1;
  if (a.category > b.category) return 1;
  return 0;
}

export { render as renderSpatialTreeByCategory };
