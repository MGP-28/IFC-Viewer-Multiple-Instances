import { createElement } from "../../helpers/generic/domElements";

function renderContextMenuItem(text) {
  const classCSS = text != "" ? "context-menu-item" : "context-menu-seperator";
  const element = createElement("li", {
    classes: [classCSS],
    textContent: text,
  });

  return element;
}

export { renderContextMenuItem };