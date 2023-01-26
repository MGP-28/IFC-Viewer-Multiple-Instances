import { buildIcon } from "../../generic/icon";
import { icons } from "../../../configs/icons";
import getNodePropertyName from "../../../helpers/getNodePropertyName";
import { getIfcRegex } from "../../../helpers/repositories/regex";
import * as SpatialTreeInterelementEventHandling from "../../events/spatialTreeElementEvents";
import * as Models from "../../../stores/models";
import { createElement } from "../../../helpers/generic/domElements";
import { emitEventOnElement } from "../../../helpers/emitEvent";

/**
 * Builds tree
 * @param {Object[]} branches Array of tree branches as it will be displayed
 */
async function buildTree(container, branches) {
  container.appendChild(buildToolbar());
  // Builds promise array
  const branchEls = branches.map(async (branch) => await buildNode(branch));
  // Resolves all promises, in order, and appends returned elements
  Promise.all(branchEls).then((elements) => container.append(...elements));
}

/**
 *  Builds tree node. If node has children, works recursively via buildChildren()
 * @param {Object} node
 * @returns DOM Element 'li'
 */
async function buildNode(node, parentList) {
  const nodeEl = document.createElement("li");
  const title = await buildTitle(node, parentList);
  nodeEl.appendChild(title);

  if (hasChildren(node)) {
    const childrenEl = await buildChildren(node);
    childrenEl.classList.add("hidden");

    title.addEventListener("click", () => {
      emitEventOnElement(childrenEl, "renderChildren");
      childrenEl.classList.toggle("hidden");
      const caret = title.getElementsByClassName("spatial-tree-caret")[0];
      caret.classList.toggle("caret-down");
    });

    nodeEl.appendChild(childrenEl);
  }

  return nodeEl;
}

/**
 *  Builds tree node title.
 * @param {Object} node
 * @returns DOM Element 'span'
 */
async function buildTitle(node, parentList) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("tree-item");

  if (hasChildren(node)) {
    const caretIcon = document.createElement("div");
    caretIcon.classList.add("spatial-tree-caret");
    caretIcon.appendChild(buildIcon(icons.chevronRight));
    wrapper.appendChild(caretIcon);
    wrapper.classList.add("has-caret");
  } else wrapper.classList.add("tree-leaf");

  // create node title span
  const span = createElement("span");
  if (node.title) span.textContent = node.title;
  else {
    const baseName = await getNodePropertyName(node);
    const cleanName = removeIFCTagsFromName(baseName);
    span.textContent = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
  }
  // Content will be added later, as lazy load
  wrapper.appendChild(span);

  const visibilityIcon = document.createElement("div");
  visibilityIcon.appendChild(buildIcon(icons.visibility));

  const selectIcon = document.createElement("div");
  selectIcon.appendChild(buildIcon(icons.target));

  const isolateIcon = document.createElement("div");
  isolateIcon.appendChild(buildIcon(icons.partof));

  const nodeIcons = {
    visibility: visibilityIcon,
    selection: selectIcon,
    isolation: isolateIcon,
  };

  await processIconEvents(wrapper, nodeIcons, node);

  for (const key in nodeIcons) {
    const iconEl = nodeIcons[key];
    iconEl.classList.add("spatial-tree-icon");
    wrapper.appendChild(iconEl);
  }

  return wrapper;
}

/**
 *  Builds tree node children. If any child has children of their own, works recursively
 * @param {Object} node
 * @returns DOM Element 'ul'
 */
async function buildChildren(node) {
  const childrenEl = createElement("ul");
  let isFirstRender = true;
  // Lazy loading of children
  childrenEl.addEventListener("renderChildren", async () => {
    if (!isFirstRender) return;
    isFirstRender = false;
    for (const childNode of node.children) {
      if (!childNode.title) childrenAreLeaves = true;
      const node = await buildNode(childNode, childrenEl);
      childrenEl.appendChild(node);
    }
  });

  return childrenEl;
}

function buildToolbar() {
  const toolbarEl = createElement("li", {
    classes: ["spatial-tree-toolbar"],
  });

  const iconEl = createElement("div", {
    classes: ["spatial-tree-icon"],
    innerHTML: buildIcon(icons.visibility).outerHTML,
  });
  toolbarEl.appendChild(iconEl);

  let isEnabled = true;
  
  const objectsData = Models.models.map((model, modelIdx) => {
    return { modelIdx, expressIDs: model.getAllIDs() };
  });

  SpatialTreeInterelementEventHandling.handleVisibility({visibility: iconEl}, objectsData, isEnabled)

  return toolbarEl;
}

async function processIconEvents(span, icons, node) {
  await SpatialTreeInterelementEventHandling.processNodeEvents(span, icons, node);
}

function removeIFCTagsFromName(text) {
  const regex = getIfcRegex();
  return text.replace(regex, "");
}

function hasChildren(node) {
  return node.children && node.children.length > 0;
}

// Full HTML now lazy loads - obsolete
//
// function lazyLoadTitles(parent) {
//   // Create observer for lazy loading
//   const callback = async (mutationList, observer) => {
//     const mutation = mutationList[0];
//     // It it renders hidden, do nothing
//     if (mutation.target.classList.contains("hidden")) return;
//     // Emit event for children to load in
//     emitEventOnElement(parent, "lazyLoad");
//     // put observer asleep
//     observer.disconnect();
//   };
//   const observer = new MutationObserver(callback);
//   observer.observe(parent, { attributes: true });
// }

// function handleTitleLazyLoading(parent, span, node) {
//   parent.addEventListener("lazyLoad", async () => {
//     const baseName = await getNodePropertyName(node);
//     const cleanName = removeIFCTagsFromName(baseName);
//     span.textContent = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
//   });
// }

export { buildTree };
