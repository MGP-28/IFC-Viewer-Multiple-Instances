import { clearString } from "../../helpers/string";
import * as Models from "../../stores/models";
import * as SelectionStore from "../../stores/selection";

const IFCCategoriesToFecthName = ["IFCBUILDINGSTOREY"];
let currentTreeIdx = null;

export default async function startSpatialTree() {
  const treesContainer = document.createElement("div");
  treesContainer.classList.add("group-selection-container", "hidden");

  document.addEventListener("wereReady", async (event) => {
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
  const title = await buildTitle(node);
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
  const text =
    node.children.length == 0 || IFCCategoriesToFecthName.includes(node.type)
      ? await getNodePropertyName(node)
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
async function getNodePropertyName(node) {
  const model = Models.models[currentTreeIdx];
  const id = node.expressID;
  const props = await model.loader.ifcManager.getItemProperties(0, id);
  let name = node.type;

  if (props.LongName) name = props.LongName.value;
  else if (props.Name) {
    let _name = props.Name.value;
    if (props.Tag) {
      // Clears tag value from name and the preceding ':'
      _name = _name.replace(props.Tag.value, "");
      _name = _name.slice(0, -1);
    }
    name = _name;
  } else if (props.ObjectType) name = props.ObjectType.value;

  const text = clearString(name);
  return text;
}

function toggleActiveCSSClass(title, isActive) {
  if (isActive) title.classList.add("active-selection-leaf");
  else title.classList.remove("active-selection-leaf");
  return false;
}
