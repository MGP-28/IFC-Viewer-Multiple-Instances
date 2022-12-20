import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import {
  getActiveId,
  removeAnnotation,
  annotations,
} from "../../stores/annotations";
import { buildIcon } from "../generic/icon";

function renderAnnotation(annotation, parent) {
  const element = createElement("li", {
    classes: ["annotation-list-item"],
  });

  const deleteEl = buildIcon(icons.trash);
  deleteEl.classList.add("annotation-list-item-icon");
  element.appendChild(deleteEl);

  const text = createElement("span", {
    classes: ["annotation-list-item-text"],
    textContent: annotation.note,
  });
  element.appendChild(text);

  const showEl = buildIcon(icons.chevronRight);
  showEl.classList.add("annotation-list-item-icon");
  element.appendChild(showEl);

  handleEvents();

  return element;

  //
  // Aux scoped functions
  //
  function handleEvents() {
    // Delete annotation view
    deleteEl.addEventListener("click", () => {
      removeAnnotation(annotation.id);
      element.remove();
    });

    // Show annotation view
    showEl.addEventListener("click", () => {
      // 
    });

    // update active status
    parent.addEventListener("annotationChanged", () => {
      const activeId = getActiveId();
      if (annotation.id == activeId) element.classList.add("anim-gradient");
      else element.classList.remove("anim-gradient");
    });
    // check if removed. When true, removes self
    parent.addEventListener("updateAnnotationsList", (e) => {
      const removedId = e.detail.removedId;
      if (annotation.id == removedId) element.remove();
    });
  }
}

export { renderAnnotation };