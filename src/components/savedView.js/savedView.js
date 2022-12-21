import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import { loadView } from "../../helpers/savedView";
import {
  getActiveId,
  removeSavedView,
  savedViews,
} from "../../stores/savedViews";
import { buildIcon } from "../generic/icon";

function renderSavedView(savedView, parent) {
  const element = createElement("li", {
    classes: ["saved-list-item"],
  });

  const deleteEl = buildIcon(icons.trash);
  deleteEl.classList.add("saved-list-item-icon");
  element.appendChild(deleteEl);

  const text = createElement("span", {
    classes: ["saved-list-item-text"],
    textContent: savedView.note,
  });
  element.appendChild(text);

  handleEvents();

  return element;

  //
  // Aux scoped functions
  //
  function handleEvents() {
    // Delete saved view
    deleteEl.addEventListener("click", (e) => {
      e.stopPropagation();
      removeSavedView(savedView.id);
      element.remove();
    });

    // Show saved view
    element.addEventListener("click", () => {
      loadView(savedView.id);
    });

    // update active status
    document.addEventListener("savedViewChanged", () => {
      const activeId = getActiveId();
      if (savedView.id == activeId) element.classList.add("anim-gradient");
      else element.classList.remove("anim-gradient");
    });
    // check if removed. When true, removes self
    document.addEventListener("updateSavedViewsList", (e) => {
      const removedId = e.detail.removedId;
      if (savedView.id == removedId) element.remove();
    });
  }
}

export { renderSavedView };