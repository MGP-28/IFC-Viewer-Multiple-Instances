import { icons } from "../../configs/icons";
import {
  createElement,
  preventPropagation,
} from "../../helpers/generic/domElements";
import { loadView, resetView } from "../../helpers/savedView";
import {
  getActiveId,
  removeSavedView,
  savedViews,
} from "../../stores/savedViews";
import { renderConfirmationPopup } from "../confirmationPopup";
import { buildIcon } from "../generic/icon";
import {
  addMultiplesOptionsToMenuExtras,
  renderMenuItemExtrasComponent,
} from "../generic/menuItemExtraOptions";

function renderSavedView(savedView, parent) {
  const element = createElement("li", {
    classes: ["saved-list-item"],
  });

  // const deleteEl = buildIcon(icons.trash);
  // deleteEl.classList.add("saved-list-item-icon");
  // element.appendChild(deleteEl);

  const text = createElement("span", {
    classes: ["saved-list-item-text"],
    textContent: savedView.note,
  });
  element.appendChild(text);

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
  const menuExtras = createOptionsMenu(options);
  element.appendChild(menuExtras);

  handleEvents();

  return element;

  //
  // Aux scoped functions
  //
  function handleEvents() {
    // Delete saved view
    // deleteEl.addEventListener("click", (e) => {
    //   e.stopPropagation();
    //   removeSavedView(savedView.id);
    //   element.remove();
    // });

    menuExtras.addEventListener("optionSelected", (e) => {
      const idx = e.detail.idx;
      switch (idx) {
        case options.delete.idx: {
          popupConfirmationDeleteSavedView();
          break;
        }

        default:
          console.error(`Event handler for index ${idx} is not defined!`);
          break;
      }
    });

    let isEnabled = false;
    // Show saved view
    element.addEventListener("click", () => {
      isEnabled = !isEnabled;
      if (isEnabled) loadView(savedView.id);
      else resetView();
    });

    // update active status
    document.addEventListener("savedViewChanged", () => {
      const activeId = getActiveId();
      isEnabled = savedView.id == activeId;
      if (isEnabled) element.classList.add("anim-gradient");
      else element.classList.remove("anim-gradient");
    });
    // check if removed. When true, removes self
    document.addEventListener("removedSavedView", (e) => {
      const removedId = e.detail.removedId;
      if (savedView.id == removedId) element.remove();
    });

    function popupConfirmationDeleteSavedView() {
      const popupProps = {
        title: "Confirmation",
        subtitle: "",
        message: `Are you sure you want to remove the saved view "${savedView.note}"?`,
        affirmativeText: "Remove",
        negativeText: "Cancel",
      };

      const popup = renderConfirmationPopup(popupProps, true);

      document.body.appendChild(popup);

      popup.addEventListener("confirmationResult", (e) => {
        const result = e.detail.result;
        if (result) deleteSavedView();
        popup.remove();
      });

      function deleteSavedView(e) {
        removeSavedView(savedView.id);
        element.remove();
      }
    }
  }
}

function createOptionsMenu(options) {
  const menuExtras = renderMenuItemExtrasComponent();

  const eventsToPreventPropagation = ["click"];
  preventPropagation(menuExtras, eventsToPreventPropagation);

  addMultiplesOptionsToMenuExtras(menuExtras, options);

  return menuExtras;
}

export { renderSavedView };
