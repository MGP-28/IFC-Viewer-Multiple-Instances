import { buildIcon } from "../../generic/icon";
import { icons } from "../../../configs/icons";
import getNodePropertyName from "../../../helpers/getNodePropertyName";
import { getIfcRegex } from "../../../helpers/repositories/regex";
import * as SpatialTreeInterelementEventHandling from "../../events/spatialTreeElementEvents";
import * as Models from "../../../stores/models";
import { createElement } from "../../../helpers/generic/domElements";

/**
 * Builds tree
 * @param {Object[]} branches Array of tree branches as it will be displayed
 */
async function buildTree(container, branches) {
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
async function buildNode(node) {
  const nodeEl = document.createElement("li");
  const title = await buildTitle(node);
  nodeEl.appendChild(title);

  if (node.children && node.children.length > 0) {
    const childrenEl = await buildChildren(node);
    childrenEl.classList.add("hidden");

    title.addEventListener("click", () => {
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
async function buildTitle(node) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("tree-item");

  const hasChildren = node.children && node.children.length > 0;

  if (hasChildren) {
    const caretIcon = document.createElement("div");
    caretIcon.classList.add("spatial-tree-caret");
    caretIcon.appendChild(buildIcon(icons.chevronRight));
    wrapper.appendChild(caretIcon);
    wrapper.classList.add("has-caret");
  } else wrapper.classList.add("tree-leaf");

  // create node title span
  const _text = !hasChildren ? await getNodePropertyName(node) : node.title;
  const text = removeIFCTagsFromName(_text);
  const span = createElement("span", {
    textContent: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
  });
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

  //
  //
  await processIconEvents(wrapper, nodeIcons, node);
  //
  //

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
  for (const childNode of node.children) {
    const node = await buildNode(childNode);
    childrenEl.appendChild(node);
  }
  return childrenEl;
}

async function processIconEvents(span, icons, node) {
  await SpatialTreeInterelementEventHandling.processNodeEvents(span, icons, node);
}

function removeIFCTagsFromName(text) {
  const regex = getIfcRegex();
  return text.replace(regex, "");
}

export { buildTree };
