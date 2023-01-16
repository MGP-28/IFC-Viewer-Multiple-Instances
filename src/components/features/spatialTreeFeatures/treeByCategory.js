import { createElement } from "../../../helpers/generic/domElements";
import * as Models from "../../../stores/models";

async function render() {
  return createElement("span", {
    textContent: "nice",
  });

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

export { render as renderSpatialTreeByCategory };
