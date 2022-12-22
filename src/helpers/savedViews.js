import { renderFeatureContainer } from "../components/feature-sidebar/containers";
import { buildIcon } from "../components/generic/icon";
import { renderNewViewForm } from "../components/savedView.js/form";
import { renderSavedView } from "../components/savedView.js/savedView";
import { emitEventOnElement } from "./emitEvent";
import { createElement } from "./generic/domElements";
import { icons } from "../configs/icons";
import { savedViews } from "../stores/savedViews";

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

  // content
  const contentEl = wrapper.getElementsByClassName(
    "tools-side-feature-content"
  )[0];
  contentEl.innerHTML = `
    <div class="tree-content-container">
        <div class="saved-wrapper">
            <div class="saved-toolbar"></div>
            <ul class="saved-list" id="saved-views-list"></ul>
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

  const toolbarIcon = buildIcon(icons.plus);
  toolbarIcon.classList.add("saved-add", "spatial-tree-icon");
  toolbar.appendChild(toolbarIcon);

  // list
  const list = contentEl.getElementsByClassName("saved-list")[0];
  // add loaded views
  for (let idx = 0; idx < savedViews.length; idx++) {
    const savedView = savedViews[idx];
    renderListItem(savedView);
  }
  // add new views created
  list.addEventListener("newSavedView", (e) => {
    const savedView = e.detail.savedView;
    renderListItem(savedView);
  });

  function renderListItem(savedView) {
    const savedViewEl = renderSavedView(savedView, list);
    list.appendChild(savedViewEl);
  }

  // events
  handleEvents();

  // gets feature ready and opens it right away
  emitEventOnElement(wrapper, "featureReady");
  const icon = wrapper.getElementsByClassName("tools-side-feature-icon")[0];
  icon.click();

  const containerEl = document.getElementsByClassName("tools-side-content")[0];
  containerEl.appendChild(wrapper);

  isRendered = true;
  container = containerEl;
  component = wrapper;

  function handleEvents() {
    toolbarIcon.addEventListener("click", (e) => {
      e.stopPropagation();

      openSavedViewForm();
    });
  }
}

function showSavedViews() {
  container.appendChild(component);
}

function hideSavedViews() {
  container.removeChild(component);
}

function openSavedViewForm() {
  const form = renderNewViewForm();
  form.classList.remove("hidden");
  document.body.appendChild(form);
}

export { toggleSavedViews };
