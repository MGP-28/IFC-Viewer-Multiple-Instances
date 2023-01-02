import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import { getActiveId } from "../../stores/savedViews";
import { buildIcon } from "../generic/icon";
import { renderAnnotation } from "./annotation";

function renderAnnotationGroup(savedView, annotations, parent) {
  const element = createElement("li", {
    classes: ["annotation-list-group"],
  });

  const textEl = createElement("span", {
    classes: ["annotation-list-group-text"],
    textContent: savedView.note,
  });
  element.appendChild(textEl);

  const showEl = buildIcon(icons.chevronRight);
  showEl.classList.add("annotation-list-group-icon", "caret");
  element.appendChild(showEl);

  const listEl = createElement("ul", {
    classes: ["annotation-list-group-list", "hidden"],
  });
  element.appendChild(listEl);

  for (let idx = 0; idx < annotations.length; idx++) {
    const annotation = annotations[idx];
    addAnnotation(annotation);
  }

  handleEvents();
  hasChildren();

  return element;

  //
  // Aux scoped functions
  //
  function addAnnotation(annotation) {
    const annotationEl = renderAnnotation(annotation, listEl);
    listEl.appendChild(annotationEl);
  }

  function handleEvents() {
    // Delete annotation group
    document.addEventListener("removedSavedView", (e) => {
      const id = e.detail.removedId;
      if (savedView.id == id) element.remove();
    });

    let isHighlighted = false;
    // Highlight annotations
    document.addEventListener("savedViewChanged", (e) => {
      if (listEl.children.length == 0) return;

      const id = getActiveId();

      if (savedView.id == id) {
        isHighlighted = true;
        openList();
      } else {
        if (!isHighlighted) return; // already disabled; increases performance
        isHighlighted = false;
      }
      selectAllChildren();
    });

    // Add annotation
    document.addEventListener("newAnnotation", (e) => {
      const annotation = e.detail.annotation;
      if (annotation.viewId != savedView.id) return;
      addAnnotation(annotation);
      hasChildren();
    });

    // Delete annotation
    document.addEventListener("removeAnnotation", (e) => {
      const id = e.detail.removedId;
      const annotationsIds = annotations.map((x) => x.id);
      const idx = annotationsIds.indexOf(id);
      if (idx == -1) return;
      listEl.children[idx].remove();
      hasChildren();
    });

    // Show annotation group
    showEl.addEventListener("click", () => {
      showEl.classList.toggle("caret-down");
      listEl.classList.toggle("hidden");
    });

    //
    // Aux in scope
    //
    function openList() {
      showEl.classList.add("caret-down");
      listEl.classList.remove("hidden");
    }

    function selectAllChildren() {
      const eventName = isHighlighted
        ? "selectAnnotations"
        : "deselectAnnotations";
      const event = new Event(eventName);
      listEl.dispatchEvent(event);
    }
  }
  function hasChildren() {
    const isDisabled = listEl.children.length == 0;
    element.classList.toggle("annotation-list-group-disabled", isDisabled);
  }
}

export { renderAnnotationGroup };
