import getNodePropertyName from "../../helpers/getNodePropertyName";
import { getIfcRegex } from "../../helpers/repositories/regex";
import SpatialTreeReference from "../../models/SpatialTree/NodeReference";
import * as Models from "../../stores/models";
import * as SelectionStore from "../../stores/selection";
import * as SpatialTreeInterelementEventHandling from "../events/spatialTreeElementEvents";

const IFCCategoriesToFecthName = ["IFCBUILDINGSTOREY"];

let isFirstElementOfTree = true;
let useIconOnLabel = true;
let currentTreeIdx = null;
let isLevel = false;
const references = {
  modelRef: undefined,
  levelRef: undefined,
  categoryRef: undefined,
};

export default async function startSpatialTree() {
  const treesContainer = document.getElementById("spatial-trees-container");

  document.addEventListener("startFeatures", async (event) => {
    const trees = Models.models.map((x) => x.tree);
    const treesEl = await buildTreesContainer(trees);
    treesContainer.appendChild(treesEl);
  });

  return true;
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
    isLevel = true;
    localLevel = true;
    references.levelRef = undefined;
  }

  const nodeEl = document.createElement("li");
  const title = await buildTitle(node);
  nodeEl.appendChild(title);
  let childrenEl = false;
  const modelIdx = currentTreeIdx;

  if (node.children.length > 0) {
    title.classList.add("caret");
    const isCategory = localLevel;
    childrenEl = await buildChildren(node, isCategory);
    childrenEl.classList.add("hidden");

    title.addEventListener("click", () => {
      childrenEl.classList.toggle("hidden");
      title.classList.toggle("caret-down");
    });
  } else {
    const expressID = node.expressID;
    const model = Models.models[modelIdx];
    const loader = model.loader;
    const props = await loader.ifcManager.getItemProperties(0, expressID, true);
    let isSelection = false;

    addEvents();
    function addEvents() {
      title.addEventListener("mouseenter", () => {
        SelectionStore.setHighlightedProperties(props, modelIdx, false);
      });

      title.addEventListener("mouseleave", () => {
        SelectionStore.resetHighlightedProperties();
      });

      title.addEventListener("click", () => {
        if (isSelection) {
          SelectionStore.resetSelectedProperties();
          toggleActiveCSSClass(title, false);
        } else {
          SelectionStore.setSelectedProperties(props, modelIdx, false);
          toggleActiveCSSClass(title, true);
        }
        isSelection = !isSelection;
      });
      document.addEventListener("selectedChanged", () => {
        if (SelectionStore.vars.selected.props == props) return;
        toggleActiveCSSClass(title, false);
      });
    }
    if(localLevel) isLevel = false;
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
  // create node title span
  const span = document.createElement("span");
  const _text =
    node.children.length == 0 || IFCCategoriesToFecthName.includes(node.type)
      ? await getNodePropertyName(node, currentTreeIdx)
      : node.type;
  const text = removeIFCTagsFromName(_text);
  span.textContent = text;

  let hasIcon = true;
  if (!useIconOnLabel) hasIcon = toggleIcon(node);

  if (hasIcon) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-eye", "spatial-tree-visibility-icon");
    await processIconEvents(icon, node);
    span.appendChild(icon);
  }

  return span;
}

async function processIconEvents(icon, node) {
  const branchLevel = getElementLevel();
  switch (branchLevel) {
    case "building": {
      console.log("building");
      isFirstElementOfTree = false;
      useIconOnLabel = false;
      SpatialTreeInterelementEventHandling.processBuildingEvents(
        icon,
        currentTreeIdx
      );
      references.modelRef = new SpatialTreeReference(node.type, icon);
      break;
    }

    case "level": {
      console.log("level");
      const levelName = await getNodePropertyName(node, currentTreeIdx);
      SpatialTreeInterelementEventHandling.processLevelEvents(
        icon, 
        currentTreeIdx, 
        levelName
      );
      references.levelRef = new SpatialTreeReference(levelName, icon);
      break;
    }

    case "category": {
      console.log("category");
      references.categoryRef = new SpatialTreeReference(node.type, icon);
      SpatialTreeInterelementEventHandling.processCategoryNodeEvents(
        icon,
        currentTreeIdx,
        references.levelRef.name,
        node.type
      );
      break;
    }
    default: {
      console.log("leaf");
      SpatialTreeInterelementEventHandling.processLeafNodeEvents(
        icon,
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

function toggleActiveCSSClass(title, isActive) {
  if (isActive) title.classList.add("active-selection-leaf");
  else title.classList.remove("active-selection-leaf");
  return false;
}

function removeIFCTagsFromName(text) {
  const regex = getIfcRegex();
  return text.replace(regex, "");
}
