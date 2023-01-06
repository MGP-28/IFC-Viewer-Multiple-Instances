import { icons } from "../../configs/icons";
import { lightOrDark } from "../../helpers/generic/colors";
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

  const popupContentContainer = popup.querySelector(".popup-header-content");
  popupContentContainer.style.overflow = "visible";

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
  selectWrapperEl.classList.add("annotation-category-selector");

  // category renderization
  const items = [];
  const colors = [];

  // categories
  for (let idx = 0; idx < annotationCategories.length; idx++) {
    const category = annotationCategories[idx];
    const item = {
      value: category.id,
      text: category.name,
    };
    items.push(item);
    const colorTag = renderColorTag(category);
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
    let selectedCategoryId = 0;
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();

      const content = contentInput.value;

      // fields incorrectly filled
      if (!content) {
        errorName();
        return;
      }

      saveAnnotation(content, selectedCategoryId, position);

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

    select.addEventListener("selection", (e) => {
      const categoryId = e.detail.value;
      selectedCategoryId = categoryId;
    });

    //
    // Aux functions in scope
    //
    function errorName() {
      const message = "Please write an annotation";
      errorField(contentInput, message);
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
    errorEl.innerHTML = "";
    errorEl.classList.remove("hidden");
    errorEl.textContent = message;
  }
}

/**
 * Renders element based on given color. If color if undefined, renders a different styled element
 * @param {*} color Color code (hex) or undefined
 * @returns
 */
function renderColorTag(category) {
  const color = category.color;
  const colorCode = color ? "#" + color : "#00000000";
  const classes = ["annotation-category-select-colortag"];
  if (!color) classes.push("undefined");
  const element = createElement("div", {
    classes: classes,
    style: "background-color: " + colorCode,
  });
  element.title = category.name;
  element.textContent = category.reference;
  if (lightOrDark("#" + color) == "dark") element.style.color = "white";
  return element;
}

function saveAnnotation(content, categoryId, position) {
  let viewId = getActiveId();
  const annotation = new Annotation(position, viewId, categoryId, content);
  addAnnotation(annotation);
}

export { render as renderAnnotationForm, renderColorTag };
