import { icons } from "../../configs/icons";
import { render2DText } from "../../helpers/2DObject";
import {
  add2DObjectToScene,
  remove2DObjectFromScene,
} from "../../helpers/2DRendering";
import { emitEventOnElement } from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import { removeAnnotation } from "../../stores/annotations";
import { userInteractions } from "../../stores/userInteractions";
import { renderConfirmationPopup } from "../confirmationPopup";
import { buildIcon } from "../generic/icon";
import {
  addOptionToMenuExtras,
  renderMenuItemExtrasComponent,
} from "../generic/menuItemExtraOptions";
import { buildPopupWithHeader } from "../PopupWithHeader";

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

  const eventsToPreventPropagation = ["click"];
  const menuExtras = renderMenuItemExtrasComponent(eventsToPreventPropagation);
  const options = {
    delete: {
      text: "Delete",
      idx: undefined,
    },
    dummy: {
      text: "A very nice option indeed",
      idx: undefined,
    },
  };
  for (const key in options) {
    if (Object.hasOwnProperty.call(options, key)) {
      const option = options[key];
      option.idx = addOptionToMenuExtras(menuExtras, option.text);
    }
  }
  element.appendChild(menuExtras);

  handleEvents();

  return element;

  //
  // Aux scoped functions
  //
  function handleEvents() {
    // Delete annotation view

    // deleteEl.addEventListener("click", (e) => {
    //   e.stopPropagation();
    //   removeAnnotation(annotation.id);
    //   hide();
    //   element.remove();
    // });

    menuExtras.addEventListener("optionSelected", (e) => {
      const idx = e.detail.idx;
      switch (idx) {
        case options.delete.idx: {
          popupConfirmationDeleteAnnotation();
          break;
        }

        default:
          console.error(`Event handler for index ${idx} is not defined!`);
          break;
      }
    });

    let isShowing = false;
    // Show annotation view
    element.addEventListener("click", (e) => {
      if (isShowing) hide(true);
      else show(true);
    });

    const label2D = render2DText(
      annotation.position,
      category.color,
      annotation.content
    );
    // highlighting
    parent.addEventListener("selectAnnotations", show);
    parent.addEventListener("deselectAnnotations", hide);
    element.addEventListener("forceRenderAnnotation", (e) => {
      show(true);
    });

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

    function popupConfirmationDeleteAnnotation() {
      const popupProps = {
        title: "Confirmation",
        subtitle: "",
        message: "Are you sure you want to remove the annotation?",
        affirmativeText: "Remove",
        negativeText: "Cancel",
      };

      const popup = renderConfirmationPopup(popupProps, true);

      document.body.appendChild(popup);

      popup.addEventListener("confirmationResult", (e) => {
        const result = e.detail.result;
        if(result) deleteAnnotation(annotation);
        popup.remove();
      })
    }

    function deleteAnnotation() {
      removeAnnotation(annotation.id);
      hide();
      element.remove();
    }
  }
}

export { renderAnnotation };
