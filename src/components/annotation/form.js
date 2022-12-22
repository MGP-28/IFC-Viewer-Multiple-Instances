import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import Annotation from "../../models/Annotation";
import { annotationCategories } from "../../stores/annotationCategories";
import { addAnnotation } from "../../stores/annotations";
import { getActiveId } from "../../stores/savedViews";
import { addItemToFormSelect, renderFormSelect } from "../generic/formSelect";
import { buildIcon } from "../generic/icon";
import { buildPopupWithHeader } from "../PopupWithHeader";
import { renderAnnotationCategoryForm } from "./categoryForm";

function render(position) {
  const headerProps = {
    title: "Annotations",
    subtitle: "Create a new annotation",
    icon: icons.annotations,
  };

  //
  // Popup element
  const popup = buildPopupWithHeader(headerProps);
  popup.classList.toggle("hidden");

  const container = popup.getElementsByClassName("popup-header-content")[0];

  container.innerHTML = `
    <form class="styling-form">
      <label for="category" class="styling-form-label">Category</label>
      <div class="styling-form-select-plus-add"></div>
      <label for="name" class="styling-form-label">Annotation</label>
      <input type="text" id="annotation-form-name" class="styling-form-input annotation-form-input" name="name">
      <span id="styling-form-warning" class="styling-form-warning hidden"></span>
      <input type="submit" value="Create" class="styling-form-submit">
    </form>
  `;

  const selectWrapperEl = container.getElementsByClassName(
    "styling-form-select-plus-add"
  )[0];

  const items = [];
  const colors = [];
  for (let idx = 0; idx < annotationCategories.length; idx++) {
    const category = annotationCategories[idx];
    const item = {
      value: category.id,
      text: category.name,
    };
    items.push(item);
    const colorTag = renderColorTag(category.color);
    colors.push(colorTag);
  }
  const select = renderFormSelect(items);
  const list = select.querySelector("ul");
  for (let idx = 0; idx < list.children.length; idx++) {
    const item = list.children[idx];
    const colorTag = colors[idx];
    item.insertBefore(colorTag, item.children[0]);
  }
  selectWrapperEl.appendChild(select);

  const icon = buildIcon(icons.plus);
  icon.classList.add("styling-form-icon");
  selectWrapperEl.appendChild(icon);

  handleEvents();

  return popup;

  function handleEvents() {
    popup.addEventListener("toggle", () => {
      popup.remove();
    });

    const formEl = container.querySelector(".styling-form");
    const contentInput = container.querySelector("#annotation-form-name");
    let categorySelected = undefined;
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();

      const content = contentInput.value;

      // fields incorrectly filled
      if (!content) {
        errorName();
        return;
      }

      const categoryId = categorySelected === undefined ? 0 : categorySelected;
      saveAnnotation(content, categoryId, position);

      popup.remove();
    });

    icon.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      renderAnnotationCategoryForm();
    });

    document.addEventListener("newAnnotationCategory", (e) => {
      const category = e.detail.annotationCategory;
      const item = {
        value: category.id,
        text: category.name,
      };
      items.push(item);
      const colorTag = renderColorTag(category.color);
      colors.push(colorTag);
      addItemToFormSelect(select, item);
      const lastItem = list.lastChild;
      lastItem.insertBefore(colorTag, lastItem.children[0]);
    });

    const selectText = select.querySelector("span");
    select.addEventListener("selection", (e) => {
      const categoryId = e.detail.value;
      const itemSelected = items.find((x) => x.value == categoryId);
      selectText.textContent = itemSelected.text;
    });

    //
    // Aux functions in scope
    //
    function errorName() {
      const message = "Please write an annotation";
      errorField(contentInput, message)
    }
  }

  //
  // Aux functions in scope
  //
  function errorField(fieldEl, message) {
    fieldEl.classList.remove("error");
    fieldEl.classList.add("error");
    fieldEl.addEventListener("focus", classing);

    errorMessage(message);

    function classing() {
      fieldEl.classList.remove("error");
      fieldEl.removeEventListener("focus", classing);
    }
  }

  function errorMessage(message) {
    const errorEl = container.getElementsByClassName("styling-form-warning")[0];
    errorEl.classList.remove("hidden");
    errorEl.textContent = message;
  }
}

function renderColorTag(color) {
  const element = createElement("div", {
    classes: ["annotation-category-select-colortag"],
    style: "background-color: #" + color,
  });
  return element;
}

function saveAnnotation(content, categoryId, position){
  let viewId = getActiveId();
  if(!viewId) viewId = 0;
  const annotation = new Annotation(position, viewId, categoryId, content);
  addAnnotation(annotation);
}

export { render as renderAnnotationForm };
