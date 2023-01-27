import { icons } from "../../configs/icons";
import getCuratedCategoryNameById from "../../helpers/categoryNames";
import { emitEventOnElement } from "../../helpers/emitEvent";
import { loadCSS } from "../../helpers/generic/cssLoader";
import { createElement } from "../../helpers/generic/domElements";
import { capitalizeFirstLetter } from "../../helpers/generic/strings";
import featureRenderingHandler from "../../helpers/navbar/featureRenderingHandler";
import * as SelectionStore from "../../stores/selection";

const mainProperties = [
  {
    label: "expressID",
    getter: (props) => props.expressID,
  },
  {
    label: "type",
    getter: (props) => props.type,
  },
  {
    label: "GlobalId",
    getter: (props) => props.GlobalId,
  },
  {
    label: "Name",
    getter: (props) => props.Name,
  },
  {
    label: "ObjectType",
    getter: (props) => props.ObjectType,
  },
  {
    label: "Tag",
    getter: (props) => props.Tag,
  },
  {
    label: "PredefinedType",
    getter: (props) => props.PredefinedType,
  },
];

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function build(navItem) {
  const element = initializeProperties();

  loadCSS("./src/assets/css/properties.css");

  document.addEventListener("openProperties", (e) => {
    navItem.isActive = true;
    featureRenderingHandler(navItem);
  });

  return element;
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function load(navItem) {
  const listEl = navItem.getContentElement().firstChild;
  updateData(listEl);
}

/**
 *
 * @param {NavbarItem} navItem
 * @returns
 */
function unload(navItem) {
  //
}

export { build, load, unload };

function initializeProperties() {
  const listEl = createElement("ul", {
    classes: ["properties-list"],
  });
  document.addEventListener("selectedChanged", () => {
    updateData(listEl);
  });
  return listEl;
}

function updateData(listEl) {
  const selected = SelectionStore.vars.selected;

  if (!selected.isValid() || selected.isGroupSelection()) {
    reset(listEl);
    return;
  }

  let category = getCuratedCategoryNameById(selected.props.type);
}

function renderProperties() {
  //
}

function reset(listEl) {
  listEl.innerHTML = `${buildHeader("Select an object").outerHTML}`;
  listEl.innerHTML += `${buildDataLine("Label", "value").outerHTML}`;
  listEl.innerHTML += `${buildDataLine("Label", "value").outerHTML}`;
  listEl.innerHTML += `${buildDataLine("Label", "value").outerHTML}`;
  listEl.innerHTML += `${buildHeader("Select an object").outerHTML}`;
  listEl.innerHTML += `${buildDataLine("Label", "value").outerHTML}`;
}

function buildHeader(title) {
  return createElement("li", {
    classes: ["properties-header"],
    textContent: title,
  });
}

function buildDataLine(label, value) {
  const lineEl = createElement("li", {
    classes: ["properties-line"],
  });
  const labelEl = createElement("span", {
    classes: ["properties-line-label"],
    textContent: label
  });
  const valueEl = createElement("span", {
    classes: ["properties-line-value"],
    textContent: value
  });
  lineEl.append(labelEl, valueEl);
  return lineEl;
}

function buildData(label, value) {
  //
}

function buildPset(pset) {
  //
}
