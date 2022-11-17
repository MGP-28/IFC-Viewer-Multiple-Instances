import { removeSubset } from "../helpers/buildSubset";
import emitGlobalEvent from "../helpers/emitEvent";
import RaycastIntersectObject from "../models/raycastIntersectObject";
import * as Models from "../stores/models";
import * as RaycastStore from "../stores/raycast";
import * as SelectionStore from "../stores/selection";

const IFCCategoriesToFecthName = ["IFCBUILDINGSTOREY"];
let currentTreeIdx = null;

export default async function startSpatialTree() {
  const treesContainer = document.createElement("div");
  treesContainer.classList.add("tree-container", "hidden");

  document.body.appendChild(treesContainer);

  document.addEventListener("wereReady", async (event) => {
    const trees = Models.models.map((x) => x.tree);

    const tabsEl = buildTreesTabs(trees);
    const treesEl = await buildTreesContainer(trees);
    treesContainer.appendChild(tabsEl);
    treesContainer.appendChild(treesEl);

    treesContainer.classList.remove("hidden");
  });
}

function buildTreesTabs(trees) {
  const treeTabs = document.createElement("div");
  treeTabs.classList.add("tree-tabs-container");

  for (let idx = 0; idx < trees.length; idx++) {
    const treeTabEl = document.createElement("div");
    treeTabEl.classList.add("tree-tab");
    treeTabEl.textContent = `Tab ${idx}`;
    treeTabEl.addEventListener("click", () => {
      console.log("click");
      SelectionStore.setselectedSpatialTree(idx);
    });
    document.addEventListener("spatialTreeSelected", () => {
      if (SelectionStore.selectedSpatialTreeIdx == idx)
        treeTabEl.classList.add("tab-active");
      else treeTabEl.classList.remove("tab-active");
    });
    treeTabs.appendChild(treeTabEl);
  }
  return treeTabs;
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

    if (idx > 0) treeContentEl.classList.add("hidden");

    document.addEventListener("spatialTreeSelected", () => {
      if (SelectionStore.selectedSpatialTreeIdx == idx)
        treeContentEl.classList.remove("hidden");
      else treeContentEl.classList.add("hidden");
    });
    treeContent.appendChild(treeContentEl);
  }

  return treeContent;
}

/**
 * Builds spatial tree
 * @param {DOM element} parent parent element to append content
 * @param {Object} tree tree generated on model loading
 */
async function buildTree(tree) {
  const treeEl = document.createElement("ul");
  // treeEl.classlist.add()

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
  const nodeEl = document.createElement("li");
  // create node
  const title = buildTitle(node);
  nodeEl.appendChild(title);
  let childrenEl = false;

  if (node.children.length > 0) {
    title.classList.add("caret");
    childrenEl = await buildChildren(node);
    childrenEl.classList.add("hidden");

    title.addEventListener("click", () => {
      childrenEl.classList.toggle("hidden");
      title.classList.toggle("caret-down");
    });
  } else {
    const expressID = node.expressID;
    const model = Models.models[currentTreeIdx]
    const loader = model.loader;
    const props = await loader.ifcManager.getItemProperties(0, expressID, true);
    const object = await loader.ifcManager.byId(0, expressID);
    const foundObj = new RaycastIntersectObject(object, currentTreeIdx);
    let isSelection = false;

    title.addEventListener("mouseenter", () => {
      isSelection = false;
      RaycastStore.setFound(foundObj);
      SelectionStore.setSelectedProperties(props, false, false);
    });

    title.addEventListener("mouseleave", () => {
      if (isSelection) {
        removeSubset(model, "highlighted");
      }
      removeSelection(true, true);
    });

    title.addEventListener("click", () => {
      if (isSelection) {
        isSelection = false;
        removeSelection(true, true);
      } else {
        isSelection = true;
        RaycastStore.setFound(foundObj);
        SelectionStore.setSelectedProperties(props, true, false);
      }
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
function buildTitle(node) {
  // create node title span
  const span = document.createElement("span");
  const text =
    node.children.length == 0 || IFCCategoriesToFecthName.includes(node.type)
      ? getNodePropertyName(node)
      : node.type;
  span.textContent = text;
  return span;
}

/**
 *  Builds tree node children. If any child has children of their own, works recursively
 * @param {Object} node
 * @returns DOM Element 'ul'
 */
async function buildChildren(node) {
  const childrenEl = document.createElement("ul");
  for (const childNode of node.children) {
    const node = await buildNode(childNode);
    childrenEl.appendChild(node);
  }
  return childrenEl;
}

/**
 *  Get node name by gettign the objects properties via expressID
 * @param {Object} node
 * @returns string
 */
function getNodePropertyName(node) {
  return node.type + " AHHHH";
}

// Helpers
function removeSelection(isSelection, isFromViewer) {
  isSelection = false;
  RaycastStore.resetFound();
  SelectionStore.setSelectedProperties(null, isSelection, isFromViewer);
}
