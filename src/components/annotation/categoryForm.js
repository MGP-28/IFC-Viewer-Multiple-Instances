import { icons } from "../../configs/icons";
import { buildPopupWithHeader } from "../PopupWithHeader";
import {
  renderChangesAfterLoad,
  renderColorPicker,
} from "../generic/colorPicker";
import {
  addAnnotationCategory,
  annotationCategories,
} from "../../stores/annotationCategories";
import AnnotationCategory from "../../models/AnnotationCategory";
import { annotationCategoryValidator } from "../../validators/annotationCategory/annotationCategory";
import { createElement } from "../../helpers/generic/domElements";
import { consoleLogObject } from "../../helpers/generic/logging";

function render() {
  const headerProps = {
    title: "Annotation Category",
    subtitle: "Create a new annotation category",
    icon: icons.annotations,
  };

  //
  // Popup element
  const popup = buildPopupWithHeader(headerProps);
  popup.classList.toggle("hidden");

  const container = popup.getElementsByClassName("popup-header-content")[0];

  container.innerHTML = `
    <form class="styling-form">
      <label for="note" class="styling-form-label">Name</label>
      <input type="text" id="annotation-form-category-name" class="styling-form-input" name="note">
      <label for="reference" class="styling-form-label">Reference</label>
      <input type="text" id="annotation-form-category-reference" class="styling-form-input" name="reference" title="3 letters, underscore, 3 numbers" placeholder="AAA-000">
      <label for="color" class="styling-form-label">Color</label>
      <div class="styling-form-color-picker-wrapper"></div>
      <p id="styling-form-warning" class="styling-form-warning hidden"></p>
      <input type="submit" value="Create" class="styling-form-submit">
    </form>
  `;

  const colorPickerWrapper = container.querySelector(
    ".styling-form-color-picker-wrapper"
  );

  const colorPicker = renderColorPicker(false);
  colorPickerWrapper.appendChild(colorPicker);
  document.body.appendChild(popup);
  renderChangesAfterLoad(colorPicker);

  handleEvents();

  function handleEvents() {
    const formEl = container.querySelector(".styling-form");
    const nameInput = document.getElementById("annotation-form-category-name");
    const referenceInput = document.getElementById(
      "annotation-form-category-reference"
    );

    popup.addEventListener("toggle", () => {
      popup.remove();
    });

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = nameInput.value;
      const color = colorPicker.hex.slice(1);
      const reference = referenceInput.value.toUpperCase();
      const obj = { name, color, reference };

      const result = annotationCategoryValidator(obj);

      if (result == true) {
        saveAnnotationCategory(obj);
        popup.remove();
      } else {
        const references = [
          { name: "Name", element: nameInput },
          { name: "Reference", element: referenceInput },
        ];
        errors(references, result);
      }
    });

    formEl.addEventListener("click", (e) => e.stopPropagation());

    popup.addEventListener("click", () => {
      popup.remove();
    });

    //
    // Aux functions in scope
    //

    function errors(references, errors) {
      let errorElements = [];

      for (let idx = 0; idx < errors.length; idx++) {
        const message = errors[idx];
        const element = references.find((x) =>
          message.includes(x.name)
        ).element;
        element.classList.remove("error");
        element.classList.add("error");
        element.addEventListener("focus", classing);

        function classing() {
          element.classList.remove("error");
          element.removeEventListener("focus", classing);
        }

        const errorElement = createElement("span", {
          textContent: message,
        });

        errorElements.push(errorElement);
      }

      errorMessage(errorElements);
    }
  }

  function errorMessage(errorElements) {
    const errorEl = container.getElementsByClassName("styling-form-warning")[0];
    errorEl.innerHTML = "";
    errorEl.classList.remove("hidden");
    errorElements.forEach((element) => errorEl.appendChild(element));
  }

  function saveAnnotationCategory(annotationCategory) {
    const {name, color, reference} = annotationCategory;
    const newAnnotationCategory = new AnnotationCategory(name, color, reference);
    addAnnotationCategory(newAnnotationCategory);
  }
}

export { render as renderAnnotationCategoryForm };
