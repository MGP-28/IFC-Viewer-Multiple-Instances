import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import { buildIcon } from "../generic/icon";

function renderSavedView(savedView) {
  const element = createElement("li", {
    classes: ["saved-list-item"],
  });

  const deleteEl = buildIcon(icons.trash);
  deleteEl.classList.add("saved-list-item-icon");
  element.appendChild(deleteEl);

  const text = createElement("span", {
    classes: ["saved-list-item-text"],
    textContent: savedView.textContent
  });
  element.appendChild(text);

  const showEl = buildIcon(icons.chevronRight);
  showEl.classList.add("saved-list-item-icon");
  element.appendChild(showEl);

  function handleEvents() {
    
  }
}

export { renderSavedView };
