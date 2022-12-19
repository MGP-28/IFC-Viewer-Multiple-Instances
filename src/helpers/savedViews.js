import { renderFeatureContainer } from "../components/feature-sidebar/containers";
import { buildIcon } from "../components/generic/icon";
import { icons } from "../configs/icons";
import { emitEventOnElement } from "./emitEvent";
import { createElement } from "./generic/domElements";

let isRendered = false;
let container = undefined;
let component = undefined;

function toggleSavedViews(isShowing) {
  if (!isRendered) renderSavedViews();

  if (isShowing) showSavedViews();
  else hideSavedViews();
}

function renderSavedViews() {
  // build wrapper and content
  const wrapper = renderFeatureContainer(
    icons.savedViews,
    "Saved Views",
    "Manage your saved views"
  );

  emitEventOnElement(wrapper, "featureReady");

  const contentEl = wrapper.getElementsByClassName(
    "tools-side-feature-content"
  )[0];
  contentEl.innerHTML = `
    <div class="tree-content-container">
        <div class="saved-wrapper">
            <div class="saved-toolbar"></div>
            <ul class="saved-list"></ul>
        </div>
    </div>
  `;

  // toolbar
  const toolbar = contentEl.getElementsByClassName("saved-toolbar")[0];
  const toolbarSpan = createElement("span", {
    classes: ["saved-add-text"],
    textContent: "Save new view",
  });
  toolbar.appendChild(toolbarSpan);

  const toolbarIcon = buildIcon("plus");
  toolbarIcon.classList.add("saved-add", "spatial-tree-icon");
  toolbar.appendChild(toolbarIcon);

  // list
  const list = contentEl.getElementsByClassName("saved-list")[0];

  // events
  handleEvents();

  const containerEl = document.getElementsByClassName("tools-side-content")[0];
  containerEl.appendChild(wrapper);

  isRendered = true;
  container = containerEl;
  component = wrapper;

  function handleEvents() {
    toolbarIcon.addEventListener("click", (e) => {
        e.stopPropagation();

        openSavedViewForm();
    })

    list.addEventListener("updateSavedViewsList", () => {
        
    })
  }
}

function showSavedViews() {
  container.appendChild(component);
}

function hideSavedViews() {
  container.removeChild(component);
}

function openSavedViewForm(){
    //
}

export { toggleSavedViews };
