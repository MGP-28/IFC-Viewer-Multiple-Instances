import { icons } from "../../../configs/icons";
import { createElement } from "../../../helpers/generic/domElements";
import featureRenderingHandler from "../../../helpers/navbar/featureRenderingHandler";
import NavbarItem from "../../../models/navbar/NavbarItemData";
import { buildIcon } from "../../generic/icon";
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
    // if (subitem.hasSidebarTab) {
    //   subitem.tabElement = renderSidebarTab(subitem);
    // }
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

      item.isActive = !item.isActive;

      // only runs if there are no subitems
      featureRenderingHandler(item);

      // navbarItem.classList.toggle("active"); -> is now handled by events
    });

    navbarItem.addEventListener("loaded", (e) => {
      item.isActive = true;
      navbarItem.classList.toggle("active", true);
    });

    navbarItem.addEventListener("unloaded", (e) => {
      item.isActive = false;
      navbarItem.classList.toggle("active", false);
    });
  }

  function handleSubitemEvents() {
    navbarItem.addEventListener("subitemSelected", (e) => {
      const eventIdx = e.detail.idx;
      const hasExclusivity = e.detail.hasExclusivity;
      const subitems = item.subitems;
      const changesArr = [];

      for (let idx = 0; idx < subitems.length; idx++) {
        const subitem = subitems[idx];
        if (eventIdx != idx) {
          if (!hasExclusivity) continue;
          if (!subitem.isExclusive) continue;
          if (!subitem.isRendered) continue;
          if (!subitem.isActive) continue;
          subitem.isActive = false;
        } else subitem.isActive = true;
        changesArr.push(subitem);
      }

      // Sort array to make sure to unload items before loading others
      changesArr.sort((a, b) => {
        return a.isActive == true && b.isActive == false;
      });

      changesArr.forEach((subitem) => {
        featureRenderingHandler(subitem);
      });

      navbarItem.classList.toggle("active", true);
    });

    navbarItem.addEventListener("subitemDeselected", (e) => {
      checkStatus();
    });

    navbarItem.addEventListener("subitemDeselectedOutter", (e) => {
      checkStatus();
    });

    function checkStatus() {
      const activeSubitems = navbarItem.getElementsByClassName("active");
      if (activeSubitems.length == 0) navbarItem.classList.toggle("active", false);
    }
  }

  function hasSubitems() {
    return item.subitems !== undefined && item.subitems.length > 0;
  }
}

export { render as renderNavbarItem };
