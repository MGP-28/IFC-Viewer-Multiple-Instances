import { createElement } from "../../helpers/generic/domElements";
import * as SelectionStore from "../../stores/selection";
import { renderFeatureContainer } from "./containers";

const mainProperties = [
  "ExpressID",
  "Type",
  "GlobalID",
  "Name",
  "ObjectType",
  "Tag",
  "PredefinedType",
];

export default function startPropertiesFeature() {
  const wrapper = renderFeatureContainer(
    "building-06",
    "Object properties",
    "Select a object"
  );
  const contentEl = wrapper.getElementsByClassName("tools-side-feature-content")[0];

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

  const tableEl = contentEl.getElementsByClassName("tools-side-properties-table")[0];
  mainProperties.forEach(element => {
    const propertyEl = buildLi(element, "");
    tableEl.appendChild(propertyEl);
  });

  let activeTabIdx = 0;
  const tabsWrapper = contentEl.getElementsByClassName("tools-side-properties-tabs")[0];
  tabsWrapper.addEventListener("tabChanged", () => {
    for (let idx = 0; idx < tabsWrapper.children.length; idx++) {
        const element = tabsWrapper.children[idx];
        console.log(element)
        if(idx === activeTabIdx) element.classList.add("tab-active")
        else element.classList.remove("tab-active")
    }
  })
  for (let idx = 0; idx < tabsWrapper.children.length; idx++) {
    const element = tabsWrapper.children[idx];
    element.addEventListener("click", () => {
        activeTabIdx = idx;
        const event = new Event("tabChanged");
        tabsWrapper.dispatchEvent(event)
    })
  }

  const featureName = wrapper.getElementsByClassName("tools-side-feature-name")[0];
  const propertiesHeaderEl = contentEl.getElementsByClassName("tools-side-properties-header")[0];
  document.addEventListener("selectedChanged", () => {
    const selected = SelectionStore.vars.selected;
    console.log(selected.isGroupSelection())
    if (selected.isGroupSelection()) return;
    mainProperties.forEach(propertyName => {
        const id = `property-${propertyName}`
        const domElement = document.getElementById(id);
        domElement.textContent = selected.props[propertyName];
    });
  })

  return wrapper;
}

function buildLi(property, value) {
  const li = createElement("li");
  const id = `property-${property}`;
  const propertySpan = createElement("span", { textContent: property });
  const valueSpan = createElement("span", { textContent: value, id: id });
  li.appendChild(propertySpan);
  li.appendChild(valueSpan);
  return li;
}