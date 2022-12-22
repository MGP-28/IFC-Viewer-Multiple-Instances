import { icons } from "../../configs/icons";
import { buildPopupWithHeader } from "../PopupWithHeader";
import {
  renderChangesAfterLoad,
  renderColorPicker,
} from "../generic/colorPicker";
import { addAnnotationCategory, annotationCategories } from "../../stores/annotationCategories";
import AnnotationCategory from "../../models/AnnotationCategory";

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
      <input type="text" id="annotation-form-category-input" class="styling-form-input" name="note">
      <label for="color" class="styling-form-label">Color</label>
      <div class="styling-form-color-picker-wrapper"></div>
      <span id="styling-form-warning" class="styling-form-warning hidden"></span>
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
    const nameInput = document.getElementById("annotation-form-category-input");

    popup.addEventListener("toggle", () => {
      popup.remove();
    });

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = nameInput.value;

      // fields incorrectly filled
      if (!name) {
        errorName(true);
        return;
      }

      // fields filled
      const categoriesNamesUsed = annotationCategories.map((x) => x.name);
      const isNameValid = categoriesNamesUsed.indexOf(name) == -1;

      if (!isNameValid) {
        errorName(false);
        return;
      }

      const color = colorPicker.hex.slice(1);

      saveAnnotationCategory(name, color);

      popup.remove();
    });

    formEl.addEventListener("click", (e) => e.stopPropagation());

    popup.addEventListener("click", () => {
      popup.remove();
    });

    //
    // Aux functions in scope
    //
  
    function errorName(isEmpty) {
      nameInput.classList.remove("error");
      nameInput.classList.add("error");
      nameInput.addEventListener("focus", classing);
  
      const message = isEmpty
        ? "Please input a category name"
        : "There's already a category with the same name";
  
      errorMessage(message);
  
      function classing() {
        nameInput.classList.remove("error");
        nameInput.removeEventListener("focus", classing);
      }
    }
  }
  
  function errorMessage(message) {
    const errorEl = container.getElementsByClassName("styling-form-warning")[0];
    errorEl.classList.remove("hidden");
    errorEl.textContent = message;
  }

  function saveAnnotationCategory(name, color){
    const annotationCategory = new AnnotationCategory(name, color);
    addAnnotationCategory(annotationCategory);
  }
}

export { render as renderAnnotationCategoryForm };
