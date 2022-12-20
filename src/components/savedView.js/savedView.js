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

  const showEl = buildIcon(icons.chevronRight);
  showEl.classList.add("saved-list-item-icon");
  element.appendChild(showEl);

  handleEvents();

  return element;

  //
  // Aux scoped functions
  //
  function handleEvents() {
    // Delete saved view
    deleteEl.addEventListener("click", () => {
      removeSavedView(savedView.id);
      element.remove();
    });

    // Show saved view
    showEl.addEventListener("click", () => {
      loadView(savedView.id);
    });

    // update active status
    parent.addEventListener("savedViewChanged", () => {
      const activeId = getActiveId();
      if (savedView.id == activeId) element.classList.add("active-saved-view");
      else element.classList.remove("active-saved-view");
    });
    // check if removed. When true, removes self
    parent.addEventListener("updateSavedViewsList", (e) => {
      const removedId = e.detail.removedId;
      if (savedView.id == removedId) element.remove();
    });
  }
}

export { renderSavedView };
