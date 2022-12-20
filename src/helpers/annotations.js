import { renderFeatureContainer } from "../components/feature-sidebar/containers";
import { buildIcon } from "../components/generic/icon";
import { renderNewViewForm } from "../components/annotation.js/form";
import { renderAnnotation } from "../components/annotation.js/annotation";
import { emitEventOnElement } from "./emitEvent";
import { createElement } from "./generic/domElements";
import { icons } from "../configs/icons";
import { annotations } from "../stores/annotations";

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
            <div class="annotations-toolbar"></div>
            <ul id="annotations-list"></ul>
        </div>
    </div>
  `;

  // toolbar
  const toolbar = contentEl.getElementsByClassName("annotations-toolbar")[0];
  const toolbarSpan = createElement("span", {
    classes: ["annotations-add-text"],
    textContent: "Add new annotation",
  });
  toolbar.appendChild(toolbarSpan);
  const toolbarIcon = buildIcon("plus");
  toolbarIcon.classList.add("annotations-add", "spatial-tree-icon");
  toolbar.appendChild(toolbarIcon);

  // list
  const list = contentEl.getElementsByClassName("annotations-list")[0];
  // add loaded views
  for (let idx = 0; idx < annotations.length; idx++) {
    const annotation = annotations[idx];
    renderListItem(annotation);
  }
  // add new views created
  list.addEventListener("newAnnotation", (e) => {
    const annotation = e.detail.annotation;
    renderListItem(annotation);
  });

  function renderListItem(annotation) {
    const annotationEl = renderAnnotation(annotation, list);
    list.appendChild(annotationEl);
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

      openAnnotationForm();
    });
  }
}

function showAnnotations() {
  container.appendChild(component);
}

function hideAnnotations() {
  container.removeChild(component);
}

function openAnnotationForm() {
  const form = renderNewViewForm();
  form.classList.remove("hidden");
  document.body.appendChild(form);
}

export { toggleAnnotations };
