import { icons } from "../../configs/icons";
import { emitEventOnElement } from "../../helpers/emitEvent";
import { lightOrDark } from "../../helpers/generic/colors";
import { createElement } from "../../helpers/generic/domElements";
import { getActiveId } from "../../stores/savedViews";
import { userInteractions } from "../../stores/userInteractions";
import { buildIcon } from "../generic/icon";
import { renderAnnotation } from "./annotation";
import { renderColorTag } from "./form";
import { consoleLogObject } from "../../helpers/generic/logging";

function renderAnnotationCategory(annotationCategory, annotations, parent) {
  const _annotations = [...annotations];

  const element = createElement("li", {
    classes: ["annotation-list-group", "annotation-list-group-category"],
  });

  const showEl = buildIcon(icons.chevronRight);
  showEl.classList.add("annotation-list-group-icon", "caret");
  element.appendChild(showEl);

  const categoryColorTag = annotationCategory.color
    ? renderColorTag(annotationCategory.color)
    : renderColorTag();
  categoryColorTag.title = annotationCategory.name;
  categoryColorTag.textContent = annotationCategory.reference;
  if (lightOrDark("#" + annotationCategory.color) == "dark")
    categoryColorTag.style.color = "white";
  element.appendChild(categoryColorTag);

  const textEl = createElement("span", {
    classes: ["annotation-list-group-text"],
    textContent: annotationCategory.name,
    title: annotationCategory.name,
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

  for (let idx = 0; idx < _annotations.length; idx++) {
    const annotation = _annotations[idx];
    addAnnotation(annotation);
  }

  handleEvents();
  hasChildren();

  return element;

  //
  // Aux scoped functions
  //
  function addAnnotation(annotation) {
    const annotationEl = renderAnnotation(
      annotationCategory,
      annotation,
      listEl
    );
    listEl.appendChild(annotationEl);
    return annotationEl;
  }

  function handleEvents() {
    let isHighlighted = false;
    // Highlight annotations
    parent.addEventListener("enableAnnotations", () => {
      isHighlighted = true;
      selectAllChildren();
    });

    parent.addEventListener("disableAnnotations", () => {
      isHighlighted = false;
      selectAllChildren();
    });
    parent.addEventListener("selectAnnotations", () => {
      emitEventOnElement(listEl, "selectAnnotations");
    });
    parent.addEventListener("deselectAnnotations", () => {
      emitEventOnElement(listEl, "deselectAnnotations");
    });

    // Child dispatches event on enabling / disabling, allowing parents to keep track of how many are active
    let activeChildrenCounter = 0;
    // Enable parent on child rendering
    listEl.addEventListener("childEnabled", () => {
      activeChildrenCounter++;
      isHighlighted = true;
      changeVisibilityIcon();
      emitEventOnElement(parent, "childEnabled");
    });
    // Disable parent on child hidding
    listEl.addEventListener("childHidden", () => {
      activeChildrenCounter--;
      if (activeChildrenCounter == 0) isHighlighted = false;
      changeVisibilityIcon();
      emitEventOnElement(parent, "childHidden");
    });

    // Add annotation
    parent.addEventListener("newAnnotation", (e) => {
      // check if annotation is part of category
      const annotation = e.detail.annotation;
      if (annotation.categoryId != annotationCategory.id) return;
      // update local annotation array
      _annotations.push(annotation);
      // add annotation to UI, forces render
      const annotationEl = addAnnotation(annotation);
      emitEventOnElement(annotationEl, "forceRenderAnnotation");
      // checks for when category is empty
      hasChildren();
      visibilityEl.classList.toggle("hidden", false);
    });

    // Delete annotation
    document.addEventListener("removeAnnotation", (e) => {
      // check if annotation was part of related category
      const id = e.detail.removedId;
      const annotationsIds = _annotations.map((x) => x.id);
      const idx = annotationsIds.indexOf(id);
      if (idx == -1) return;
      // update local array
      _annotations.splice(idx, 1);
      // remove annotation from UI
      listEl.children[idx].remove();
      // checks for when category is empty
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
    function selectAllChildren() {
      const eventName = isHighlighted
        ? "selectAnnotations"
        : "deselectAnnotations";
      const event = new Event(eventName);
      listEl.dispatchEvent(event);
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
    if(isDisabled) element.remove();
  }
}

export { renderAnnotationCategory };
