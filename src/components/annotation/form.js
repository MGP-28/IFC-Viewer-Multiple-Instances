import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import { buildPopupWithHeader } from "../PopupWithHeader";

function render() {
  const headerProps = {
    title: "Annotations",
    subtitle: "Create a new annotation",
    icon: icons.annotations,
  };

  //
  // Popup element
  const popup =  buildPopupWithHeader(headerProps);
  popup.classList.toggle("hidden");

  const container = popup.getElementsByClassName("popup-header-content")[0];

  container.innerHTML = `
        <form class="styling-form">
          <label for="note" class="styling-form-note-label">Annotation</label>
          <input type="text" id="styling-form-note-input" class="styling-form-note-input annotation-form-input" name="note">
          <label for="note" class="annotation-form-note-label">Category</label>
          <select id="annotation-form-category" name="annotation-form-category" class="styling-form-select"></select>
          <span id="styling-form-warning" class="styling-form-warning hidden"></span>
          <input type="submit" value="Create" class="styling-form-submit">
        </form>
      `;

  // handleEvents();

  return popup;
}

export { render as renderAnnotationForm };
