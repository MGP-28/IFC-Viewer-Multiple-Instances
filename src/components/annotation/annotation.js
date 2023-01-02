import { icons } from "../../configs/icons";
import { render2DText } from "../../helpers/2DObject";
import {
  add2DObjectToScene,
  remove2DObjectFromScene,
} from "../../helpers/2DRendering";
import { emitEventOnElement } from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import { getAnnotationCategoryById } from "../../stores/annotationCategories";
import { removeAnnotation } from "../../stores/annotations";
import { userInteractions } from "../../stores/userInteractions";
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
  const categoryColorTag = category
    ? renderColorTag(category.color)
    : renderColorTag();
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

    let isShowing = false;
    // Show annotation view
    element.addEventListener("click", (e) => {
      if (isShowing) hide();
      else show();
    });

    const color = category ? category.color : undefined;
    const label2D = render2DText(
      annotation.position,
      color,
      annotation.content
    );
    // highlighting
    parent.addEventListener("selectAnnotations", show);
    parent.addEventListener("deselectAnnotations", hide);

    function show() {
      if (!userInteractions.annotations) return;
      isShowing = true;
      add2DObjectToScene(label2D);
      element.classList.add("anim-gradient");
      emitEventOnElement(parent, "childEnabled");
    }

    function hide() {
      isShowing = false;
      remove2DObjectFromScene(label2D);
      element.classList.remove("anim-gradient");
      emitEventOnElement(parent, "childHidden");
    }
  }
}

export { renderAnnotation };
