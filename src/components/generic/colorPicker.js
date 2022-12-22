import "toolcool-color-picker";
import UIConfigs from "../../configs/ui";
import { createElement } from "../../helpers/generic/domElements";

function render() {
  const colorPicker = createElement("toolcool-color-picker", {
    color: `#${UIConfigs.primaryColor}`,
    classes: ["color-picker"],
  });

  return colorPicker;
}

function renderChangesAfterLoad(colorPicker) {
  renderColorPicker();

  setInterval(() => {
    if (colorPicker.opened == false) renderColorPicker();
  }, 50);

  function renderColorPicker() {
    colorPicker.opened = true;
    const colorPickerComponent =
      colorPicker.shadowRoot.children[1].querySelector(
        "toolcool-color-picker-popup"
      );
    const colorPickerPopup = colorPickerComponent.shadowRoot.children[1];
    const alphaEl = colorPickerPopup.querySelector(
      "toolcool-color-picker-alpha"
    );
    alphaEl.style.display = "none";
    const infoEl = colorPickerPopup.querySelector(
      "toolcool-color-picker-fields"
    );
    infoEl.style.display = "none";

    colorPicker.$button.style.display = "none";
    colorPickerComponent.style.display = "flex";
    colorPickerPopup.style.position = "relative";
    colorPickerPopup.style.width = "100%";
    colorPickerPopup.addEventListener("click", (e) => e.stopPropagation());
  }
}

export { render as renderColorPicker, renderChangesAfterLoad };
