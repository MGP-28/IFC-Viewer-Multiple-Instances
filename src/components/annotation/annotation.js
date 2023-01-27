import { icons } from "../../configs/icons";
import { render2DText } from "../../helpers/2DObject";
import { add2DObjectToScene, remove2DObjectFromScene } from "../../helpers/2DRendering";
import { emitEventOnElement } from "../../helpers/emitEvent";
import { createElement, preventPropagation } from "../../helpers/generic/domElements";
import { loadView } from "../../helpers/savedView";
import { removeAnnotation } from "../../stores/annotations";
import { userInteractions } from "../../stores/userInteractions";
import { renderConfirmationPopup } from "../confirmationPopup";
import { addMultiplesOptionsToMenuExtras, renderMenuItemExtrasComponent } from "../generic/menuItemExtraOptions";

function renderAnnotation(category, annotation, parent) {
  const element = createElement("li", {
    classes: ["annotation-list-item"],
  });

  // const deleteEl = buildIcon(icons.trash);
  // deleteEl.classList.add("annotation-list-item-icon");
  // element.appendChild(deleteEl);

  const text = createElement("span", {
    classes: ["annotation-list-item-text"],
    textContent: annotation.content,
  });
  element.appendChild(text);

  // menu
  const options = {
    delete: {
      text: "Delete",
      action: () => popupConfirmationDeleteAnnotation(),
    },
    view: {
      text: "Go to view",
      action: () => loadView(annotation.viewId),
    },
  };
  const menuExtras = createOptionsMenu(options);
  element.appendChild(menuExtras);

  let isShowing = false;
  const label2D = render2DText(annotation.position, category.color, annotation.content);
  handleEvents();

  return element;

  //
  // Aux scoped functions
  //
  function handleEvents() {
    // Show annotation view
    element.addEventListener("click", (e) => {
      if (isShowing) hide(true);
      else show(true);
    });

    // highlighting
    parent.addEventListener("selectAnnotations", show);
    parent.addEventListener("deselectAnnotations", hide);
    element.addEventListener("forceRenderAnnotation", (e) => {
      show(true);
    });
  }

  function popupConfirmationDeleteAnnotation() {
    const popupProps = {
      title: "Confirmation",
      subtitle: "",
      message: `Are you sure you want to remove the annotation: "[${category.reference}] ${annotation.content}"?`,
      affirmativeText: "Remove",
      negativeText: "Cancel",
    };

    const popup = renderConfirmationPopup(popupProps, true);

    document.body.appendChild(popup);

    popup.addEventListener("confirmationResult", (e) => {
      const result = e.detail.result;
      if (result) deleteAnnotation(annotation);
      popup.remove();
    });
  }

  function deleteAnnotation() {
    removeAnnotation(annotation.id);
    hide(true);
    element.remove();
  }

  function show(isClick) {
    if (!userInteractions.annotations) return;
    isShowing = true;
    add2DObjectToScene(label2D);
    element.classList.add("anim-gradient");
    if (isClick) emitEventOnElement(parent, "childEnabled");
  }

  function hide(isClick) {
    isShowing = false;
    remove2DObjectFromScene(label2D);
    element.classList.remove("anim-gradient");
    if (isClick) emitEventOnElement(parent, "childHidden");
  }
}

function createOptionsMenu(options) {
  const menuExtras = renderMenuItemExtrasComponent();

  const eventsToPreventPropagation = ["click"];
  preventPropagation(menuExtras, eventsToPreventPropagation);

  addMultiplesOptionsToMenuExtras(menuExtras, options);

  return menuExtras;
}
export { renderAnnotation };
