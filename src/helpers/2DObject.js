import { createElement } from "./generic/domElements";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { lightOrDark } from "./generic/colors";

function render2DText(position, baseColorCode, text) {
  const color = `#${baseColorCode ? baseColorCode : "FFFFFF"}`;
  const bg = `${color}${baseColorCode ? "CC" : "99"}`;

  const label = createElement("p", {
    classes: ["2d-object-span"],
    textContent: text,
  });
  label.style.backgroundColor = bg;
  label.style.borderColor = baseColorCode ? color : "#FFFFFF";
  label.style.borderStyle = baseColorCode ? "solid" : "dashed solid";
  label.style.borderWidth = baseColorCode ? "2px" : "1px";
  label.style.borderRadius = "4px";
  label.style.padding = "4px";

  if (lightOrDark(color) == "dark") label.style.color = "white";

  const text2D = new CSS2DObject(label);
  text2D.position.copy(position);

  return text2D;
}

export { render2DText };
