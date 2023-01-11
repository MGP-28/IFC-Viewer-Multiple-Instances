import { createElement } from "../../../helpers/generic/domElements";
import NavbarItem from "../../../models/navbar/NavbarItemData";
import { renderNavbar } from "./navbar";

export default function initializeNavbar() {
  // Create each feature item for navbar
  const navbarItems = [];

  //// Temporary, for testing
  const build = (item) => createElement("span", { textContent: item.title });

  // Window (Selection tree, Properties)
  const window = new NavbarItem("Window", build);
  //// subitems
  const selectionTree = new NavbarItem("Selection Tree", build, "l1");
  selectionTree.hasSidebarTab = true;
  const properties = new NavbarItem("Properties", build, "l2");
  properties.hasSidebarTab = true;
  // append subitems
  window.subitems.push(selectionTree, properties);
  navbarItems.push(window);

  // Visibility
  const visibility = new NavbarItem("Visibility", build);
  //// subitems
  const views = new NavbarItem("Views", build, "r1");
  const annotations = new NavbarItem("Annotations", build, "r2");
  // append subitems
  visibility.subitems.push(views, annotations);
  navbarItems.push(visibility);

  // Clipping planes
  const clippingPlanes = new NavbarItem("Clipping planes", build);
  navbarItems.push(clippingPlanes);

  // Measure
  const measure = new NavbarItem("Measure", build);
  navbarItems.push(measure);
  //// subitems
  const measurePoint2point = new NavbarItem("Point to point", build);
  measurePoint2point.isExclusive = true;
  const measureObject = new NavbarItem("Object", build);
  measureObject.isExclusive = true;
  // append subitems
  measure.subitems.push(measurePoint2point, measureObject);

  // Explode
  const explode = new NavbarItem("Explode", build);
  //// subitems
  const explodeCategory = new NavbarItem("By category", build);
  explodeCategory.isExclusive = true;
  const explodeLevel = new NavbarItem("By level", build);
  explodeLevel.isExclusive = true;
  const explodeDiscipline = new NavbarItem("By discipline", build);
  explodeDiscipline.isExclusive = true;
  const explodeSystem = new NavbarItem("By system", build);
  explodeSystem.isExclusive = true;
  // append subitems
  explode.subitems.push(explodeCategory, explodeLevel);
  navbarItems.push(explode);

  renderNavbar(navbarItems);

  return;
}
