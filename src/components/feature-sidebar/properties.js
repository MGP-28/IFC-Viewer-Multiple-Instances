import getCuratedCategoryNameById from "../../helpers/categoryNames";
import { emitEventOnElement } from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import { capitalizeFirstLetter } from "../../helpers/generic/strings";
import * as SelectionStore from "../../stores/selection";
import { renderFeatureContainer } from "./containers";

const mainProperties = [
  "expressID",
  "type",
  "GlobalId",
  "Name",
  "ObjectType",
  "Tag",
  "PredefinedType",
];

export default function startPropertiesFeature() {
  // build wrapper and content
  const wrapper = renderFeatureContainer(
    "building-06",
    "Object properties",
    "Select an object"
  );
  const contentEl = wrapper.getElementsByClassName(
    "tools-side-feature-content"
  )[0];

  contentEl.innerHTML = `
    <div class="tools-side-properties-tabs">
        <div class="tools-side-properties-tab tab-active" id="properties-tab-props">
            Properties
        </div>
        <div class="tools-side-properties-tab" id="properties-tab-material">
            Material
        </div>
        <div class="tools-side-properties-tab" id="properties-tab-psets">
            Property Sets
        </div>
    </div>
    <div class="tools-side-properties-content-container">
        <div class="tools-side-properties-header"></div>
        <div class="tools-side-properties-table-wrapper">
            <ul class="tools-side-properties-table">
                <li>
                    <span>Property</span>
                    <span>Value</span>
                </li>
            </ul>
        </div>
    </div>
    `;

  // build tabs and manage events
  let activeTabIdx = 0;
  const tabsWrapper = contentEl.getElementsByClassName(
    "tools-side-properties-tabs"
  )[0];

  // when a tab is selected, changes each child to reflect changes
  tabsWrapper.addEventListener("tabChanged", () => {
    for (let idx = 0; idx < tabsWrapper.children.length; idx++) {
      const element = tabsWrapper.children[idx];
      if (idx === activeTabIdx) element.classList.add("tab-active");
      else element.classList.remove("tab-active");
    }
  });

  // event handlers on each tab
  for (let idx = 0; idx < tabsWrapper.children.length; idx++) {
    const element = tabsWrapper.children[idx];
    element.addEventListener("click", () => {
      activeTabIdx = idx;
      emitEventOnElement(tabsWrapper, "tabChanged");
    });
  }

  // main properties' tab
  const tableEl = contentEl.getElementsByClassName(
    "tools-side-properties-table"
  )[0];
  // add a line for each property defined as "main"
  mainProperties.forEach((element) => {
    const propertyText = capitalizeFirstLetter(element);
    const propertyEl = buildLi(propertyText, "", element);
    tableEl.appendChild(propertyEl);
  });

  //
  //
  //
  const headerText = wrapper.getElementsByClassName(
    "tools-side-feature-name"
  )[0];
  document.addEventListener("selectedChanged", () => {
    const selected = SelectionStore.vars.selected;

    let category = getCuratedCategoryNameById(selected.props.type);

    if (selected.isValid() && !selected.isGroupSelection()) {

      mainProperties.forEach((propertyName) => {

        const id = `property-${propertyName}`;
        const domElement = document.getElementById(id);
        const value = selected.props[propertyName];

        let text = value;
        if(!value) text = "-"
        else if(typeof value === "object") text = value.value
        else if(propertyName == "type") text = category

        domElement.textContent = text;
      });
      // Changes feature header displayed name
      const _headerText = `${category} - ${selected.props.expressID}`
      headerText.textContent = _headerText;
    } else {
      resetFields();
    }

    function resetFields() {
      mainProperties.forEach((propertyName) => {
        const id = `property-${propertyName}`;
        const domElement = document.getElementById(id);
        domElement.textContent = "";
      });
    }
  });
  //
  //
  //
  // await loader.ifcManager.getPropertySets(modelId, elementId);

  // feature activating event handling
  document.addEventListener("startFeatures", async (event) => {
    emitEventOnElement(wrapper, "featureReady");
  });

  return wrapper;
}

function buildLi(property, value, ref) {
  const li = createElement("li");
  const id = `property-${ref}`;
  const propertySpan = createElement("span", { textContent: property });
  const valueSpan = createElement("span", { textContent: value, id: id });
  li.appendChild(propertySpan);
  li.appendChild(valueSpan);
  return li;
}
