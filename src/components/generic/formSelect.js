import { icons } from "../../configs/icons";
import { emitCustomEventOnElement } from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import { buildIcon } from "./icon";

function render(items) {
  const element = createElement("div", {
    classes: ["styling-form-input", "styling-form-select"],
  });
  const display = createElement("span");
  const icon = buildIcon(icons.chevronRight);
  const list = createElement("ul", {
    classes: ["hidden"],
  });
  [display, icon, list].forEach((el) => element.appendChild(el));

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    renderItem(item);
  }

  eventHandlerList();

  return element;

  //
  // AUX
  //
  function renderItem(item) {
    const itemEl = createElement("li", {
      value: item.value,
    });
    const span = createElement("span", {
      textContent: item.text,
    });
    itemEl.appendChild(span);
    list.appendChild(itemEl);
    eventHandlerItem(itemEl, item);
  }

  function eventHandlerList() {
    element.addEventListener("click", (e) => {
      list.classList.toggle("hidden");
    });
    element.addEventListener("addItem", (e) => {
      const item = e.detail.item;
      renderItem(item);
    });
  }

  function eventHandlerItem(itemEl, item) {
    itemEl.addEventListener("click", (e) => {
      // render UI
      display.textContent = item.text;
      // emit new value
      const detail = {
        value: item.value,
      };
      emitCustomEventOnElement(element, "selection", detail);
    });
  }
}

function addItem(formSelect, item) {
  const detail = {
    item: item,
  };
  emitCustomEventOnElement(formSelect, "addItem", detail);
}

export { render as renderFormSelect, addItem as addItemToFormSelect };
