import { createElement } from "../../../helpers/generic/domElements";
import NavbarItem from "../../../models/navbar/NavbarItemData";
import { renderNavbar } from "../../navbar/navbar";

export default function initializeNavbar() {
  // Create each feature item for navbar
  const navbarItems = [];

  //// Temporary, for testing
  const build = (item) => createElement("span", { textContent: item.title });

  // Window (Selection tree, Properties)
  const window = new NavbarItem("Window", false, build);
  //// subitems
  const selectionTree = new NavbarItem("Selection Tree", true, build);
  selectionTree.hasSidebarTab = true;
  const properties = new NavbarItem("Properties", true, build);
  properties.hasSidebarTab = true;
  // append subitems
  window.subitems.push(selectionTree, properties);
  navbarItems.push(window);

  // Views
  const views = new NavbarItem("Views", true, build);
  navbarItems.push(views);

  // Clipping planes
  const clippingPlanes = new NavbarItem("Clipping planes", false, build);
  navbarItems.push(clippingPlanes);

  // Annotations
  const annotations = new NavbarItem("Annotations", true, build);
  navbarItems.push(annotations);

  // Measure
  const measure = new NavbarItem("Measure", true, build);
  navbarItems.push(measure);

  renderNavbar(navbarItems);

  return;
}
