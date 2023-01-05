import { icons } from "../../configs/icons";
import {
  emitCustomEventOnElement,
  emitEventOnElement,
} from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import { getAnnotationCategoryById } from "../../stores/annotationCategories";
import { removeAnnotation } from "../../stores/annotations";
import { getActiveId } from "../../stores/savedViews";
import { userInteractions } from "../../stores/userInteractions";
import { buildIcon } from "../generic/icon";
import { renderAnnotationCategory } from "./annotationsCategory";

function renderAnnotationGroup(savedView, annotations, parent) {
  const _annotations = [...annotations];

  // order annotations by category
  _annotations.sort(function (a, b) {
    return a.categoryId > b.categoryId;
  });

  // get used categories' data
  let currentCategoryId = undefined;
  const categories = {};
  for (let idx = 0; idx < _annotations.length; idx++) {
    const annotation = _annotations[idx];
    if (currentCategoryId !== annotation.categoryId) {
      currentCategoryId = annotation.categoryId;
      const category = getAnnotationCategoryById(currentCategoryId);
      categories[currentCategoryId] = {
        category,
        annotations: [annotation],
      };
    } else categories[currentCategoryId].annotations.push(annotation);
  }

  const element = createElement("li", {
    classes: ["annotation-list-group"],
  });

  const showEl = buildIcon(icons.chevronRight);
  showEl.classList.add("annotation-list-group-icon", "caret");
  element.appendChild(showEl);

  const textEl = createElement("span", {
    classes: ["annotation-list-group-text"],
    textContent: savedView.note,
    title: savedView.note,
  });
  element.appendChild(textEl);

  const iconPaths = {
    visible: icons.visibility,
    hidden: icons.visibilityOff,
  };
  const visibilityEl = buildIcon(iconPaths.hidden);
  visibilityEl.classList.add("annotation-list-group-icon-vis");
  element.appendChild(visibilityEl);

  if (_annotations.length == 0) visibilityEl.classList.toggle("hidden");

  const listEl = createElement("ul", {
    classes: ["annotation-list-group-list", "hidden"],
  });
  element.appendChild(listEl);

  for (const categoryId in categories) {
    const categoryObject = categories[categoryId];
    addAnnotationCategory(categoryObject.category, categoryObject.annotations);
  }

  handleEvents();
  hasChildren();

  return element;

  //
  // Aux scoped functions
  //
  function addAnnotationCategory(annotationCategory, annotations) {
    const annotationEl = renderAnnotationCategory(
      annotationCategory,
      annotations,
      listEl
    );
    listEl.appendChild(annotationEl);
  }

  function handleEvents() {
    // Delete annotation group
    document.addEventListener("removedSavedView", (e) => {
      const id = e.detail.removedId;
      annotations.forEach(annotation => {
        removeAnnotation(annotation);
      });
      if (savedView.id == id) element.remove();
    });

    let isHighlighted = false;
    // Highlight annotations
    document.addEventListener("savedViewChanged", (e) => {
      handleChildrenRendering();
    });

    document.addEventListener("enableAnnotations", () => {
      handleChildrenRendering();
    });

    document.addEventListener("disableAnnotations", () => {
      isHighlighted = false;
      selectAllChildren();
    });

    let activeChildrenCounter = 0;
    // Enable parent on child highlight
    listEl.addEventListener("childEnabled", () => {
      activeChildrenCounter++;
      isHighlighted = true;
      changeVisibilityIcon();
    });

    listEl.addEventListener("childHidden", () => {
      activeChildrenCounter--;
      if (activeChildrenCounter == 0) isHighlighted = false;
      changeVisibilityIcon();
    });

    // Add annotation
    document.addEventListener("newAnnotation", (e) => {
      // check if annotation was added to its related saved view; if not, exits
      const annotation = e.detail.annotation;
      if (annotation.viewId != savedView.id) return;
      // update local array
      _annotations.push(annotation);
      // checks if category already exists. IF not, creates UI for it
      const categoryIdsPresent = annotations.map((x) => x.categoryId);
      if (!categoryIdsPresent.includes(annotation.categoryId)) {
        const category = getAnnotationCategoryById(annotation.categoryId);
        addAnnotationCategory(
          category,
          []
        );
      }
      // dispatchs events to children categories (the correct category category will be the one rendering the annotation)
      emitCustomEventOnElement(listEl, "newAnnotation", e.detail);
      // checks for when saved view is empty
      hasChildren();
      visibilityEl.classList.toggle("hidden", false);
    });

    // Delete annotation
    document.addEventListener("removeAnnotation", (e) => {
      // check if annotation was part of related saved view
      const id = e.detail.removedId;
      const annotationsIds = _annotations.map((x) => x.id);
      const idx = annotationsIds.indexOf(id);
      if (idx == -1) return;
      // update local array
      _annotations.splice(idx, 1);
      // dispatchs events to children categories (the correct category category will be the one rendering the changes)
      emitCustomEventOnElement(listEl, "removeAnnotation", { id });
      // checks for when saved view is empty
      hasChildren();
    });

    // Show annotation group
    showEl.addEventListener("click", () => {
      showEl.classList.toggle("caret-down");
      listEl.classList.toggle("hidden");
    });

    visibilityEl.addEventListener("click", () => {
      isHighlighted = !isHighlighted;
      selectAllChildren();
    });

    //
    // Aux in scope
    //
    function handleChildrenRendering() {
      if (listEl.children.length == 0) return;

      // Force hidding when annotations are disabled by user
      if (!userInteractions.annotations && isHighlighted) {
        isHighlighted = false;
        selectAllChildren();
        return;
      }

      const id = getActiveId();
      if (savedView.id == id) {
        isHighlighted = true;
        openList();
      } else {
        if (!isHighlighted) return; // already disabled; increases performance
        isHighlighted = false;
      }
      selectAllChildren();
    }

    function openList() {
      showEl.classList.add("caret-down");
      listEl.classList.remove("hidden");
    }

    function selectAllChildren() {
      const eventName = isHighlighted
        ? "selectAnnotations"
        : "deselectAnnotations";
      emitEventOnElement(listEl, eventName);
      changeVisibilityIcon();
    }

    function changeVisibilityIcon() {
      if (isHighlighted)
        visibilityEl.src = visibilityEl.src.replace(
          iconPaths.hidden + ".",
          iconPaths.visible + "."
        );
      else
        visibilityEl.src = visibilityEl.src.replace(
          iconPaths.visible + ".",
          iconPaths.hidden + "."
        );
    }
  }
  function hasChildren() {
    const isDisabled = listEl.children.length == 0;
    element.classList.toggle("annotation-list-group-disabled", isDisabled);
  }
}

export { renderAnnotationGroup };
