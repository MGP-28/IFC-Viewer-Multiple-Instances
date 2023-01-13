import { emitCustomEventOnElement } from "../../../helpers/emitEvent";
import { createElement } from "../../../helpers/generic/domElements";

/**
 * Renders tabs component for sidebar feature.
 * All events pass tab "ref" as detail
 * Emits: tabSelected
 * Listens: selectTab, deselectTab
 * @param {object[]} tabs {title, ref, status} - title refers to the text displayed in the UI; ref is used when for event handling between the component and the parent; status is wether it renders active of not
 * @param {boolean} isOnlyOneActiveTab Default true; Wether or not tabs disable automatically when another one is selected
 */
function render(tabs, isOnlyOneActiveTab = true) {
  const element = createElement("ul", {
    classes: ["sidebar-feature-tabs-wrapper"],
  });

  tabs.forEach((tab) => {
    const tabEl = createElement("li", {
      classes: ["sidebar-feature-tabs-tab"],
      textContent: tab.title,
    });
    if (tab.status) tabEl.classList.toggle("active", true);
    handleTabEvents(tab, tabEl);
    element.appendChild(tabEl);
  });

  return element;

  function handleTabEvents(tab, tabEl) {
    // Emits "tabSelected" to parent element on click and enables "active" class
    tabEl.addEventListener("click", (e) => {
      const isActive = tabEl.classList.contains("active");
      if (isActive) emitCustomEventOnElement(element, "tabDeselected", { ref: tab.ref });
      else emitCustomEventOnElement(element, "tabSelected", { ref: tab.ref });
    });

    // Listens "tabSelected" triggered by other tab or own tab
    element.addEventListener("tabSelected", (e) => {
      const ref = e.detail.ref;
      let isActivedTab = false;
      if (tab.ref === ref) isActivedTab = true;

      // When multiple tabs can be active at the same time and it's not the selected tab by the user, do nothing;
      if (!isOnlyOneActiveTab && !isActivedTab) return;

      tabEl.classList.toggle("active", isActivedTab);
    });

    // Listens "tabDeselected" triggered by other tab or own tab
    element.addEventListener("tabDeselected", (e) => {
      disableActiveStatus(tabEl, tab, e);
    });

    // Listens "selectTab" coming from outside parent and enables "active" class
    element.addEventListener("selectTab", (e) => {
      const ref = e.detail.ref;
      if (tab.ref !== ref) return;
      tabEl.classList.toggle("active", true);
    });

    // Listens "deselectTab" coming from outside parent and disables "active" class
    element.addEventListener("deselectTab", (e) => {
      disableActiveStatus(tabEl, tab, e);
    });
  }
}

function disableActiveStatus(element, data, event) {
  const ref = event.detail.ref;
  if (data.ref !== ref) return;
  element.classList.toggle("active", false);
}

export { render as renderSidebarTabs };
