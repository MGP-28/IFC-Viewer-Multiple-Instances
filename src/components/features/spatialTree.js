import * as Models from "../../stores/models";
import { createElement } from "../../helpers/generic/domElements";
import { addTabsToSidebarFeature } from "./sidebar/sidebarFeature";
import { renderSpatialTreeByCategory } from "./spatialTreeFeatures/treeByCategory";
import { renderSpatialTreeByLevelCategory } from "./spatialTreeFeatures/treeByLevelCategory";
import { renderSpatialTreeBySystem } from "./spatialTreeFeatures/treeBySystem";
import { renderSpatialTreeByDiscipline } from "./spatialTreeFeatures/treeByDiscipline";
import { emitCustomEventOnElement } from "../../helpers/emitEvent";
import LeafNode from "../../models/SpatialTree/LeafNode";
import { addObjectData } from "../../stores/renderObjects";
import { loadCSS } from "../../helpers/generic/cssLoader";

const tabControls = [
  { title: "Tree", ref: 0, status: false, content: undefined, buildFunction: renderSpatialTreeByLevelCategory },
  { title: "Category", ref: 1, status: false, content: undefined, buildFunction: renderSpatialTreeByCategory },
  { title: "System", ref: 2, status: false, content: undefined, buildFunction: renderSpatialTreeBySystem },
  { title: "Discipline", ref: 3, status: false, content: undefined, buildFunction: renderSpatialTreeByDiscipline },
];

async function build(item) {
  loadCSS("src/assets/css/spatialTree.css");

  const contentEl = createElement("div", {
    classes: ["tree-container"],
  });

  const trees = Models.models.map((x) => x.tree);
  let leafNodes = undefined;

  // Calls web worker to get all leaf nodes from all models
  // An array of objects is returned. Each object contains:
  // expressId, modelIdx, levelId, category
  // Array comes naturally ordered by model -> level -> category
  const worker = new Worker("/src/tools/workers/spatialTree/getLeafNodes.js", { type: "module" });

  worker.postMessage(trees);

  worker.onerror = (event) => {
    console.log("There is an error with your worker!");
  };

  worker.onmessage = (e) => {
    leafNodes = e.data;

    leafNodes.forEach(async (leaf) => {
      const leafNodeInst = new LeafNode(leaf);
      addObjectData(leafNodeInst);
    });

    addTabsToSidebarFeature(item.component, tabControls);

    worker.terminate();
  };

  handleEvents();

  return contentEl;

  function handleEvents() {
    item.component.addEventListener("tabSelected", (e) => {
      const index = e.detail.ref;
      const tabData = tabControls[index];
      updateContent(item, tabData);
    });
  }
}

let firstLoad = true;
async function load(item) {
  if (!firstLoad) return;
  const activeTab = tabControls.find((x) => x.status);
  emitCustomEventOnElement(item.component, "selectTab", { ref: activeTab.ref });
  updateContent(item, activeTab);
  firstLoad = false;
}

async function updateContent(item, tabData) {
  const element = item.component.getElementsByClassName("tree-container")[0];
  if (tabData.content === undefined) tabData.content = await tabData.buildFunction();
  element.innerHTML = "";
  element.appendChild(tabData.content);
}

async function getObjectData(leaf) {
  const model = Models.models[leaf.modelIdx];
  const props = await model.loader.ifcManager.getItemProperties(0, leaf.expressId);
  const psets = await model.loader.ifcManager.getPropertySets(0, leaf.expressId);

  const result = {
    baseProps: props,
    psetProps: [],
  };

  for (let i = 0; i < psets.length; i++) {
    const pset = psets[i];
    if (!pset.HasProperties) continue;
    for (let j = 0; j < pset.HasProperties.length; j++) {
      const prop = pset.HasProperties[j];
      if (!prop.value) continue;
      const psetProp = await model.loader.ifcManager.getItemProperties(0, prop.value);
      result.psetProps.push(psetProp);
    }
  }

  return result;
}

export { build, load };
