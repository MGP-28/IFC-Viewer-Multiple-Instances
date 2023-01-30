import { icons } from "../../configs/icons";
import getCuratedCategoryNameById from "../../helpers/categoryNames";
import { emitEventOnElement, emitGlobalEvent } from "../../helpers/emitEvent";
import { loadCSS } from "../../helpers/generic/cssLoader";
import { createElement } from "../../helpers/generic/domElements";
import { capitalizeFirstLetter } from "../../helpers/generic/strings";
import getNodePropertyName from "../../helpers/getNodePropertyName";
import featureRenderingHandler from "../../helpers/navbar/featureRenderingHandler";
import { getPsets } from "../../helpers/psets";
import * as SelectionStore from "../../stores/selection";
getNodePropertyName

const mainProperties = [
  {
    label: "Name",
    getter: (objectData) => getNodePropertyName(objectData),
  },
  {
    label: "Express ID",
    getter: (objectData) => objectData.expressID,
  },
  {
    label: "Type",
    getter: (objectData) => getCuratedCategoryNameById(objectData.props.type),
  },
  {
    label: "Global ID",
    getter: (objectData) => objectData.props.GlobalId,
  },
  {
    label: "Object Type",
    getter: (objectData) => objectData.props.ObjectType,
  },
  {
    label: "Tag",
    getter: (objectData) => objectData.props.Tag,
  },
  {
    label: "Reference",
    getter: (objectData) => objectData.props.PredefinedType,
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

  emitGlobalEvent("loading");

  const modelIdx = parseInt(Object.keys(selected.objects)[0]);
  const expressID = selected.objects[modelIdx][0];

  setTimeout(async () => {
    const psets = await getPsets(modelIdx, expressID);

    const objectData = {
      modelIdx,
      expressID,
      props: selected.props,
      psets: psets,
    };

    console.log("objectToRender", objectData);

    listEl.innerHTML = renderProperties(listEl, objectData).outerHTML;

    emitGlobalEvent("loadingComplete");
  }, 1);
}

function renderProperties(listEl, objectToRender) {
  // temporary debug
  return createElement("li", {
    textContent: "data",
  });

  // Render top priority properties

  // Render other properties

  // Render other psets

  // let category = getCuratedCategoryNameById(objectToRender.props.type);
}

function reset(listEl) {
  listEl.innerHTML = `${buildHeader("Select an object").outerHTML}`;
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
    textContent: label,
  });
  const valueEl = createElement("span", {
    classes: ["properties-line-value"],
    textContent: value,
  });
  lineEl.append(labelEl, valueEl);
  return lineEl;
}

function buildPset(pset) {
  //
}

function cleanPsetTitle(title) {
  return title.replace("Pset_", "");
}

function getPsetPropData(prop) {
  return {
    label: prop.Name,
    value: cleanPsetPropValue(prop.NominalValue.value),
  };
}

function cleanPsetPropValue(value) {
  switch (value) {
    case "F":
      return "False";
    case "T":
      return "True";
    default:
      return value;
  }
}
