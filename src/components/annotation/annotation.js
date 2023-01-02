import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import { getAnnotationCategoryById } from "../../stores/annotationCategories";
import {
  removeAnnotation,
} from "../../stores/annotations";
import { buildIcon } from "../generic/icon";
import { renderColorTag } from "./form";

function renderAnnotation(annotation, parent) {
  const element = createElement("li", {
    classes: ["annotation-list-item"],
  });

  const deleteEl = buildIcon(icons.trash);
  deleteEl.classList.add("annotation-list-item-icon");
  element.appendChild(deleteEl);

  const category = getAnnotationCategoryById(annotation.categoryId);
  const categoryColorTag = category ? renderColorTag(category.color) : renderColorTag();
  categoryColorTag.title = category ? category.name : "Uncategorized";
  element.appendChild(categoryColorTag);

  const text = createElement("span", {
    classes: ["annotation-list-item-text"],
    textContent: annotation.content,
  });
  element.appendChild(text);

  handleEvents();

  return element;

  //
  // Aux scoped functions
  //
  function handleEvents() {
    // Delete annotation view
    deleteEl.addEventListener("click", (e) => {
      e.stopPropagation();
      removeAnnotation(annotation.id);
      element.remove();
    });

    // Show annotation view
    element.addEventListener("click", () => {
      // 
    });

    // highlighting
    parent.addEventListener("selectAnnotations", (e) => {
      element.classList.add("anim-gradient");
      //
    });
    parent.addEventListener("deselectAnnotations", (e) => {
      element.classList.remove("anim-gradient");
      //
    });
  }
}

export { renderAnnotation };