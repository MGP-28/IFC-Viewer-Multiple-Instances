import { createElement } from "../../helpers/generic/domElements";

function renderContextMenuItem(text, hasSeperator) {
  const classes = ["context-menu-item"];
  if(hasSeperator) classes.push("context-menu-seperator");
  const element = createElement("li", {
    classes,
    textContent: text,
  });

  return element;
}

export { renderContextMenuItem };