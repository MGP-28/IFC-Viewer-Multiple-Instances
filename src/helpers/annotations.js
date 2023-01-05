import { renderFeatureContainer } from "../components/feature-sidebar/containers";
import { emitEventOnElement } from "./emitEvent";
import { icons } from "../configs/icons";
import {
  annotations,
  getAnnotationsFromSavedView,
} from "../stores/annotations";
import { renderAnnotationGroup } from "../components/annotation/annotationGroup";
import { savedViews } from "../stores/savedViews";
import { getAnnotationCategoryById } from "../stores/annotationCategories";

let isRendered = false;
let container = undefined;
let component = undefined;

function toggleAnnotations(isShowing) {
  if (!isRendered) renderAnnotations();

  if (isShowing) showAnnotations();
  else hideAnnotations();
}

function renderAnnotations() {
  // build wrapper and content
  const wrapper = renderFeatureContainer(
    icons.annotations,
    "Annotations",
    "Manage your annotations"
  );

  // content
  const contentEl = wrapper.getElementsByClassName(
    "tools-side-feature-content"
  )[0];
  contentEl.innerHTML = `
    <div class="tree-content-container">
        <div class="annotations-wrapper">
            <ul class="annotations-list" id="annotations-list"></ul>
        </div>
    </div>
  `;

  // list
  const list = contentEl.getElementsByClassName("annotations-list")[0];
  // add loaded views
  //// global view
  const globalView = {
    id: 0,
    note: "Global",
  };
  renderListItem(globalView);
  //// for each saved view
  for (let idx = 0; idx < savedViews.length; idx++) {
    const savedView = savedViews[idx];
    renderListItem(savedView);
  }

  function renderListItem(savedView) {
    const annotations = getAnnotationsFromSavedView(savedView.id);
    const annotationCategoryEl = renderAnnotationGroup(
      savedView,
      annotations,
      list
    );
    list.appendChild(annotationCategoryEl);
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
    document.addEventListener("newSavedView", (e) => {
      const savedView = e.detail.savedView;
      renderListItem(savedView);
    });
  }
}

function showAnnotations() {
  container.appendChild(component);
}

function hideAnnotations() {
  container.removeChild(component);
}

function createAnnotation(position) {
  // annotation form
}

export { toggleAnnotations };
