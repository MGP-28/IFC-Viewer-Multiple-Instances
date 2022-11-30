import { buildIcon } from "../../components/generic/icon";
import { emitEventOnElement } from "../../helpers/emitEvent";
import getNodePropertyName from "../../helpers/getNodePropertyName";
import { getIfcRegex } from "../../helpers/repositories/regex";
import SpatialTreeReference from "../../models/SpatialTree/NodeReference";
import * as Models from "../../stores/models";
import * as SpatialTreeInterelementEventHandling from "../events/spatialTreeElementEvents";
import { renderFeatureContainer } from "./containers";

const IFCCategoriesToFecthName = ["IFCBUILDINGSTOREY"];

let isFirstElementOfTree = true;
let useIconOnLabel = true;
let currentTreeIdx = null;
const references = {
  modelRef: undefined,
  levelRef: undefined,
  categoryRef: undefined,
};

export default async function startSpatialTree() {
  const wrapper = renderFeatureContainer(
    "dataflow-02",
    "Spatial Tree",
    "Model Name"
  );
  const contentEl = wrapper.getElementsByClassName("tools-side-feature-content")[0];

  document.addEventListener("startFeatures", async (event) => {
    const trees = Models.models.map((x) => x.tree);
    const treesEl = await buildTreesContainer(trees);
    contentEl.appendChild(treesEl);

    emitEventOnElement(wrapper, "featureReady")
  });

  return wrapper;
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
      const caret = title.getElementsByClassName("spatial-tree-caret")[0]
      caret.classList.toggle("caret-down")
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

  const hasChildren = node.children.length > 0

  if(hasChildren) {
    const caretIcon = document.createElement("div");
    caretIcon.classList.add("spatial-tree-caret");
    caretIcon.appendChild(buildIcon("chevron-right"));
    wrapper.appendChild(caretIcon);
    wrapper.classList.add("has-caret")
  }
  else wrapper.classList.add("tree-leaf");

  // create node title span
  const span = document.createElement("span");
  const _text =
    !hasChildren || IFCCategoriesToFecthName.includes(node.type)
      ? await getNodePropertyName(node, currentTreeIdx)
      : node.type;
  const text = removeIFCTagsFromName(_text);
  span.textContent = text;
  wrapper.appendChild(span);

  let hasIcon = true;
  if (!useIconOnLabel) hasIcon = toggleIcon(node);

  if (hasIcon) {
    const visibilityIcon = document.createElement("div");
    visibilityIcon.appendChild(buildIcon("eye"));

    let selectIcon = undefined;
    if(hasChildren){
      selectIcon = document.createElement("div");
      selectIcon.appendChild(buildIcon("target-02"));
    }

    const isolateIcon = document.createElement("div");
    isolateIcon.appendChild(buildIcon("scale-01"));

    const icons = {
      visibility: visibilityIcon,
      isolation: isolateIcon
    };
    if(hasChildren) icons["selection"] = selectIcon

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
      console.log("building");
      isFirstElementOfTree = false;
      useIconOnLabel = false;
      await SpatialTreeInterelementEventHandling.processBuildingEvents(
        span,
        icons,
        currentTreeIdx
      );
      references.modelRef = new SpatialTreeReference(node.type, icons);
      break;
    }

    case "level": {
      console.log("level");
      const levelName = await getNodePropertyName(node, currentTreeIdx);
      await SpatialTreeInterelementEventHandling.processLevelEvents(
        span,
        icons,
        currentTreeIdx,
        levelName
      );
      references.levelRef = new SpatialTreeReference(levelName, icons);
      break;
    }

    case "category": {
      console.log("category");
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
      console.log("leaf");
      await SpatialTreeInterelementEventHandling.processLeafNodeEvents(
        span,
        icons,
        node.expressID,
        currentTreeIdx
      );
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
