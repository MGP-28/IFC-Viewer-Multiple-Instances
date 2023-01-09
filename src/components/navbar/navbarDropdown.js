import { emitCustomEventOnElement } from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import featureRenderingHandler from "../../helpers/navbar/featureRenderingHandler";
import NavbarItem from "../../models/navbar/NavbarItemData";

/**
 *
 * @param {NavbarItem} subitem
 */
function render(subitem, parent, idx) {
  const navbarItemDropdown = createElement("li", {
    classes: ["feature-navbar-item-dropdown-item"],
    textContent: subitem.title,
  });

  let isShowing = false;
  let isRendered = false;
  handleSubitemEvents();

  return navbarItemDropdown;

  //// Aux functions in scope

  function handleSubitemEvents() {
    navbarItemDropdown.addEventListener("click", (e) => {
      const eventName = isShowing ? "subitem-selected" : "subitem-deselected";
      emitCustomEventOnElement(parent, eventName, { idx });
    });

    parent.addEventListener("subitem-selected", (e) => {
      const eventIdx = e.detail.idx;
      if (eventIdx !== idx) {
        if (!isRendered || !isShowing) return;
        isShowing = false;
      } else isShowing = true;
      featureRenderingHandler(subitem, isShowing, isRendered);
      navbarItemDropdown.classList.toggle("active", isShowing);
    });
  }
}

// handle other item active -> subitem-selected

export { render as renderNavbarItemDropdown };
