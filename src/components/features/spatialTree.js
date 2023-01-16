import { buildIcon } from "../generic/icon";
import { icons } from "../../configs/icons";
import getNodePropertyName from "../../helpers/getNodePropertyName";
import { getIfcRegex } from "../../helpers/repositories/regex";
import SpatialTreeReference from "../../models/SpatialTree/NodeReference";
import * as Models from "../../stores/models";
import * as SpatialTreeInterelementEventHandling from "../events/spatialTreeElementEvents";
import { icons as iconsRep } from "../../configs/icons";
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

const IFCCategoriesToFecthName = ["IFCBUILDINGSTOREY"];

let isFirstElementOfTree = true;
let useIconOnLabel = true;
let currentTreeIdx = null;
const references = {
  modelRef: undefined,
  levelRef: undefined,
  categoryRef: undefined,
};

const tabControls = [
  { title: "Tree", ref: 0, status: false, content: undefined, buildFunction: renderSpatialTreeByLevelCategory },
  { title: "Category", ref: 1, status: true, content: undefined, buildFunction: renderSpatialTreeByCategory },
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
      // const objData = await getObjectData(leaf);
      // console.log(objData);

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

async function buildTreesContainer(trees) {
  const treeContent = document.createElement("div");
  treeContent.classList.add("tree-content-container");

  for (let idx = 0; idx < trees.length; idx++) {
    currentTreeIdx = idx;

    const treeContentEl = document.createElement("ul");
    treeContentEl.classList.add("tree-content");

    const treeEl = await buildTree(trees[idx]);
    treeContentEl.appendChild(treeEl);

    treeContent.appendChild(treeContentEl);
  }

  return treeContent;
}

/**
 * Builds spatial tree
 * @param {Object} tree tree generated on model loading
 */
async function buildTree(tree) {
  isFirstElementOfTree = true;
  useIconOnLabel = true;

  const treeEl = document.createElement("ul");
  // treeEl.classlist.add()

  useIconOnLabel = true;
  const treeContentEl = await buildNode(tree);
  treeEl.appendChild(treeContentEl);

  return treeEl;
}

/**
 *  Builds tree node. If node has children, works recursively via buildChildren()
 * @param {Object} node
 * @returns DOM Element 'li'
 */
async function buildNode(node) {
  let localLevel = false;
  if (IFCCategoriesToFecthName.includes(node.type)) {
    localLevel = true;
    references.levelRef = undefined;
  }

  const nodeEl = document.createElement("li");
  const title = await buildTitle(node);
  nodeEl.appendChild(title);
  let childrenEl = false;

  if (node.children.length > 0) {
    const isCategory = localLevel;
    childrenEl = await buildChildren(node, isCategory);
    childrenEl.classList.add("hidden");

    title.addEventListener("click", () => {
      childrenEl.classList.toggle("hidden");
      const caret = title.getElementsByClassName("spatial-tree-caret")[0];
      caret.classList.toggle("caret-down");
    });
  }
  nodeEl.appendChild(title);
  if (childrenEl !== false) nodeEl.appendChild(childrenEl);

  return nodeEl;
}

/**
 *  Builds tree node title.
 * @param {Object} node
 * @returns DOM Element 'span'
 */
async function buildTitle(node) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("tree-item");

  const hasChildren = node.children.length > 0;

  if (hasChildren) {
    const caretIcon = document.createElement("div");
    caretIcon.classList.add("spatial-tree-caret");
    caretIcon.appendChild(buildIcon(icons.chevronRight));
    wrapper.appendChild(caretIcon);
    wrapper.classList.add("has-caret");
  } else wrapper.classList.add("tree-leaf");

  // create node title span
  const span = document.createElement("span");
  const _text =
    !hasChildren || IFCCategoriesToFecthName.includes(node.type) ? await getNodePropertyName(node, currentTreeIdx) : node.type;
  const text = removeIFCTagsFromName(_text);
  span.textContent = text;
  wrapper.appendChild(span);

  let hasIcon = true;
  if (!useIconOnLabel) hasIcon = toggleIcon(node);

  if (hasIcon) {
    const visibilityIcon = document.createElement("div");
    visibilityIcon.appendChild(buildIcon(iconsRep.visibility));

    let selectIcon = undefined;
    if (hasChildren) {
      selectIcon = document.createElement("div");
      selectIcon.appendChild(buildIcon(iconsRep.target));
    }

    const isolateIcon = document.createElement("div");
    isolateIcon.appendChild(buildIcon(iconsRep.partof));

    const icons = {
      visibility: visibilityIcon,
      isolation: isolateIcon,
    };
    if (hasChildren) icons["selection"] = selectIcon;

    await processIconEvents(wrapper, icons, node);

    for (const key in icons) {
      const iconEl = icons[key];
      iconEl.classList.add("spatial-tree-icon");
      wrapper.appendChild(iconEl);
    }
  }

  return wrapper;
}

async function processIconEvents(span, icons, node) {
  const branchLevel = getElementLevel();
  switch (branchLevel) {
    case "building": {
      // console.log("building");
      isFirstElementOfTree = false;
      useIconOnLabel = false;
      await SpatialTreeInterelementEventHandling.processBuildingEvents(span, icons, currentTreeIdx);
      references.modelRef = new SpatialTreeReference(node.type, icons);
      break;
    }

    case "level": {
      // console.log("level");
      const levelName = await getNodePropertyName(node, currentTreeIdx);
      await SpatialTreeInterelementEventHandling.processLevelEvents(span, icons, currentTreeIdx, levelName);
      references.levelRef = new SpatialTreeReference(levelName, icons);
      break;
    }

    case "category": {
      // console.log("category");
      references.categoryRef = new SpatialTreeReference(node.type, icons);
      await SpatialTreeInterelementEventHandling.processCategoryNodeEvents(
        span,
        icons,
        currentTreeIdx,
        references.levelRef.name,
        node.type
      );
      break;
    }
    default: {
      // console.log("leaf");
      await SpatialTreeInterelementEventHandling.processLeafNodeEvents(span, icons, node.expressID, currentTreeIdx);
      break;
    }
  }
}

function toggleIcon(node) {
  if (IFCCategoriesToFecthName.includes(node.type)) {
    useIconOnLabel = true;
    return true;
  } else return false;
}

function getElementLevel() {
  if (isFirstElementOfTree) return "building";
  if (references.levelRef === undefined) return "level";
  if (references.categoryRef === undefined) return "category";
  return "leaf";
}

/**
 *  Builds tree node children. If any child has children of their own, works recursively
 * @param {Object} node
 * @returns DOM Element 'ul'
 */
async function buildChildren(node, isCategory) {
  const childrenEl = document.createElement("ul");
  for (const childNode of node.children) {
    // Resets stored category reference
    if (isCategory) references.categoryRef = undefined;

    const node = await buildNode(childNode);
    childrenEl.appendChild(node);
  }
  return childrenEl;
}

function removeIFCTagsFromName(text) {
  const regex = getIfcRegex();
  return text.replace(regex, "");
}

export { build, load };
