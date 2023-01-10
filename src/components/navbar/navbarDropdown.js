import { emitCustomEventOnElement } from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import featureRenderingHandler from "../../helpers/navbar/featureRenderingHandler";
import NavbarItem from "../../models/navbar/NavbarItemData";

/**
 *
 * @param {NavbarItem} subitem
 * @param {HTMLElement} parent
 * @param {number} idx
 * @param {boolean} isExclusive If true, disables all other items in the list also marked as exclusive
 * @returns
 */
function render(subitem, parent, idx) {
  const navbarItemDropdown = createElement("li", {
    classes: ["feature-navbar-item-dropdown-item"],
    textContent: subitem.title,
  });

  handleSubitemEvents();

  subitem.navbarItem = navbarItemDropdown;
  return navbarItemDropdown;

  //// Aux functions in scope

  function handleSubitemEvents() {
    navbarItemDropdown.addEventListener("click", (e) => {
      subitem.isActive = !subitem.isActive;
      const eventName = subitem.isActive ? "subitemSelected" : "subitemDeselected";
      emitCustomEventOnElement(parent, eventName, {
        idx,
        hasExclusivity: subitem.isExclusive,
      });
    });

    parent.addEventListener("subitemSelected", (e) => {
      // const eventIdx = e.detail.idx;
      // const hasExclusivity = e.detail.hasExclusivity;
      // if (eventIdx != idx) {
      //   if (!hasExclusivity) return;
      //   if (!subitem.isExclusive) return;
      //   if (!subitem.isRendered) return;
      //   if (!subitem.isActive) return;
      //   subitem.isActive = false;
      // } else subitem.isActive = true;
      // featureRenderingHandler(subitem);
    });

    parent.addEventListener("subitemDeselected", (e) => {
      const eventIdx = e.detail.idx;
      if (eventIdx !== idx) return;
      subitem.isActive = false;
      featureRenderingHandler(subitem);
    });

    navbarItemDropdown.addEventListener("loaded", (e) => {
      subitem.isActive = true;
      navbarItemDropdown.classList.toggle("active", true);
      parent.classList.toggle("active", true);
    });

    navbarItemDropdown.addEventListener("unloaded", (e) => {
      subitem.isActive = false;
      navbarItemDropdown.classList.toggle("active", false);
      parent.classList.toggle("active", false);
    });
  }
}

// handle other item active -> subitem-selected

export { render as renderNavbarItemDropdown };
