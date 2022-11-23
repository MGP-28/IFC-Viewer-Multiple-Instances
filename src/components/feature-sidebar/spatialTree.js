import getNodePropertyName from "../../helpers/getNodePropertyName";
import { getIfcRegex } from "../../helpers/repositories/regex";
import SpatialTreeReference from "../../models/SpatialTree/NodeReference";
import * as Models from "../../stores/models";
import * as SelectionStore from "../../stores/selection";

const IFCCategoriesToFecthName = ["IFCBUILDINGSTOREY"];
let useIconOnLabel = false;

let currentTreeIdx = null;

const references = {
  modelRef: new SpatialTreeReference(),
  levelRef: new SpatialTreeReference(),
  categoryRef: new SpatialTreeReference(),
};

export default async function startSpatialTree() {
  const treesContainer = document.createElement("div");
  treesContainer.classList.add("group-selection-container", "hidden");

  document.addEventListener("featuresCompleted", async (event) => {
    const trees = Models.models.map((x) => x.tree);

    console.log("trees", trees);

    const tabsEl = buildTreesTabs(trees);
    const treesEl = await buildTreesContainer(trees);
    treesContainer.appendChild(tabsEl);
    treesContainer.appendChild(treesEl);
  });

  return treesContainer;
}

function buildTreesTabs(trees) {
  const treeTabs = document.createElement("div");
  treeTabs.classList.add("feature-tabs-container");

  for (let idx = 0; idx < trees.length; idx++) {
    const treeTabEl = document.createElement("div");
    treeTabEl.classList.add("feature-tab");
    treeTabEl.textContent = `Tab ${idx}`;
    treeTabEl.addEventListener("click", () => {
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
 * @param {Object} tree tree generated on model loading
 */
async function buildTree(tree) {
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
  const nodeEl = document.createElement("li");
  const title = await buildTitle(node);
  // IMPLEMENT VISIBILITY ICON
  nodeEl.appendChild(title);
  let childrenEl = false;
  const modelIdx = currentTreeIdx;

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
  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-eye");
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

function toggleActiveCSSClass(title, isActive) {
  if (isActive) title.classList.add("active-selection-leaf");
  else title.classList.remove("active-selection-leaf");
  return false;
}

function removeIFCTagsFromName(text) {
  const regex = getIfcRegex();
  return text.replace(regex, "");
}
