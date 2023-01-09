import { emitEventOnElement } from "../../helpers/emitEvent";
import { createElement } from "../../helpers/generic/domElements";
import featureRenderingHandler from "../../helpers/navbar/featureRenderingHandler";
import NavbarItem from "../../models/navbar/NavbarItemData";
import { renderNavbarItemDropdown } from "./navbarDropdown";

/**
 *
 * @param {NavbarItem} item
 * @returns
 */
function render(item) {
  const navbarItem = createElement("li", {
    classes: "feature-navbar-item",
  });

  const title = createElement("span", {
    textContent: item.title
  })
  navbarItem.appendChild(title);

  let isShowing = false;
  let isRendered = false;
  handleItemEvents(navbarItem);

  if (!hasSubitems()) return navbarItem;
  // If doesn't have subitems, exists

  const sublist = createElement("ul", {
    classes: ["feature-navbar-item-dropdown", "hidden"],
  });

  for (let idx = 0; idx < item.subitems.length; idx++) {
    const subitem = item.subitems[idx];
    const subitmeEl = renderNavbarItemDropdown(subitem, navbarItem, idx);
    sublist.appendChild(subitmeEl);
  }

  handleSubitemEvents();

  return navbarItem;

  //// Aux functions in scope

  function handleItemEvents() {
    navbarItem.addEventListener("click", (e) => {
      isShowing = !isShowing;

      if (hasSubitems()) {
        sublist.classList.toggle("hidden");
        return;
      }

      // only runs if there are no subitems
      featureRenderingHandler(item, isShowing, isRendered);
      navbarItem.classList.toggle("active");
    });
  }

  function handleSubitemEvents() {
    navbarItem.addEventListener("subitem-selected", (e) => {
      navbarItem.classList.toggle("active", true);
    });

    navbarItem.addEventListener("subitem-deselected", (e) => {
      navbarItem.classList.toggle("active", false);
    });
  }

  function hasSubitems() {
    return item.subitems !== undefined && item.subitems.length > 0;
  }
}

export { render as renderNavbarItem };
