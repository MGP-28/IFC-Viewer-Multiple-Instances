import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import featureRenderingHandler from "../../helpers/navbar/featureRenderingHandler";
import NavbarItem from "../../models/navbar/NavbarItemData";
import { buildIcon } from "../generic/icon";
import { renderNavbarItemDropdown } from "./navbarDropdown";

/**
 *
 * @param {NavbarItem} item
 * @returns
 */
function render(item) {
  const navbarItem = createElement("li", {
    classes: ["feature-navbar-item"],
  });

  const title = createElement("span", {
    textContent: item.title,
  });
  navbarItem.appendChild(title);

  let isShowing = false;
  let isRendered = false;
  handleItemEvents(navbarItem);

  if (!hasSubitems()) {
    item.navbarItem = navbarItem;
    return navbarItem;
  }
  // If doesn't have subitems, exists

  const arrow = buildIcon(icons.chevronRight);
  navbarItem.appendChild(arrow);

  const sublist = createElement("ul", {
    classes: ["feature-navbar-item-dropdown", "hidden"],
  });

  for (let idx = 0; idx < item.subitems.length; idx++) {
    const subitem = item.subitems[idx];
    const subitmeEl = renderNavbarItemDropdown(subitem, navbarItem, idx);
    sublist.appendChild(subitmeEl);
  }
  navbarItem.appendChild(sublist);

  handleSubitemEvents();

  return navbarItem;

  //// Aux functions in scope

  function handleItemEvents() {
    navbarItem.addEventListener("mouseover", () => {
      const width = navbarItem.getBoundingClientRect().width;
      navbarItem.style.width = width + "px";
      if (hasSubitems()) sublist.classList.toggle("hidden");
    });

    navbarItem.addEventListener("mouseout", () => {
      if (hasSubitems()) sublist.classList.toggle("hidden");
    });

    navbarItem.addEventListener("click", (e) => {
      if (hasSubitems()) return;

      isShowing = !isShowing;

      // only runs if there are no subitems
      featureRenderingHandler(item, isShowing, isRendered);
      
      // navbarItem.classList.toggle("active"); -> is now handled by events
    });

    navbarItem.addEventListener("loaded", (e) => {
      navbarItem.classList.toggle("active", true);
    })

    navbarItem.addEventListener("unloaded", (e) => {
      navbarItem.classList.toggle("active", false);
    })
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
