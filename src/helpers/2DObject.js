import { createElement } from "./generic/domElements";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

function render2DText(position, text) {
  const label = createElement("p", {
    classes: ["2d-object-span"],
    textContent: text,
  });
  label.style.backgroundColor = "rgba(255,255,255,0.3)";
  label.style.border = "solid 1px black";
  label.style.borderRadius = "4px";
  label.style.padding = "4px";
  const text2D = new CSS2DObject(label);
  text2D.position.copy(position);

  return text2D;
}

export { render2DText };
