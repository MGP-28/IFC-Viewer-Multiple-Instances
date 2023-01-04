import { icons } from "../../configs/icons";
import { emitEventOnElement } from "../../helpers/emitEvent";
import { lightOrDark } from "../../helpers/generic/colors";
import { createElement } from "../../helpers/generic/domElements";
import { getActiveId } from "../../stores/savedViews";
import { userInteractions } from "../../stores/userInteractions";
import { buildIcon } from "../generic/icon";
import { renderAnnotation } from "./annotation";
import { renderColorTag } from "./form";

function renderAnnotationCategory(annotationCategory, annotations, parent) {
  const _annotations = [...annotations];
  console.log("cat anns", _annotations);

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
    addAnnotation(annotationCategory, annotation);
  }

  handleEvents();
  hasChildren();

  return element;

  //
  // Aux scoped functions
  //
  function addAnnotation(annotationCategory, annotation) {
    const annotationEl = renderAnnotation(
      annotationCategory,
      annotation,
      listEl
    );
    listEl.appendChild(annotationEl);
  }

  function handleEvents() {
    let isHighlighted = false;
    // Highlight annotations
    document.addEventListener("savedViewChanged", (e) => {
      handleChildrenRendering();
    });

    parent.addEventListener("enableAnnotations", () => {
      handleChildrenRendering();
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

    let activeChildrenCounter = 0;
    // Enable parent on child highlight
    listEl.addEventListener("childEnabled", () => {
      activeChildrenCounter++;
      isHighlighted = true;
      changeVisibilityIcon();
      emitEventOnElement(parent, "childEnabled");
    });

    listEl.addEventListener("childHidden", () => {
      activeChildrenCounter--;
      if (activeChildrenCounter == 0) isHighlighted = false;
      changeVisibilityIcon();
      emitEventOnElement(parent, "childHidden");
    });

    // Add annotation
    parent.addEventListener("newAnnotation", (e) => {
      const annotation = e.detail.annotation;
      _annotations.push(annotation);
      addAnnotation(annotation);
      hasChildren();
      visibilityEl.classList.toggle("hidden", false);
    });

    // Delete annotation
    document.addEventListener("removeAnnotation", (e) => {
      const idx = e.detail.idx;
      listEl.children[idx].remove();
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
    element.classList.toggle("annotation-list-group-disabled", isDisabled);
  }
}

export { renderAnnotationCategory };
