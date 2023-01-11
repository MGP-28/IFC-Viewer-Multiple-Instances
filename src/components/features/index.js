import initializeNavbar from "./navbar";
import initializeSidebar from "./sidebar";
import NavbarItem from "../../models/navbar/NavbarItemData";
import * as ClippingPlanes from "./clippingPlanes";
import { createElement } from "../../helpers/generic/domElements";

export default async function startFeatures() {
  // Create each feature item for navbar
  const navbarItems = [];

  //// Temporary, for testing
  const buildTemp = (item) => createElement("span", { textContent: item.title });

  // Window (Selection tree, Properties)
  const window = new NavbarItem("Window", buildTemp);
  //// subitems
  const selectionTree = new NavbarItem("Selection Tree", buildTemp);
  selectionTree.sidebarPosition = "l1";
  const properties = new NavbarItem("Properties", buildTemp);
  properties.sidebarPosition = "l2";
  // append subitems
  window.subitems.push(selectionTree, properties);
  navbarItems.push(window);

  // Visibility
  const visibility = new NavbarItem("Visibility", buildTemp);
  //// subitems
  const views = new NavbarItem("Views", buildTemp);
  views.sidebarPosition = "r1";
  const annotations = new NavbarItem("Annotations", buildTemp);
  annotations.sidebarPosition = "r2";
  // append subitems
  visibility.subitems.push(views, annotations);
  navbarItems.push(visibility);

  // Clipping planes
  const clippingPlanes = new NavbarItem("Clipping planes", ClippingPlanes.build, ClippingPlanes.load, ClippingPlanes.unload);
  navbarItems.push(clippingPlanes);

  // Measure
  const measure = new NavbarItem("Measure", buildTemp);
  navbarItems.push(measure);
  //// subitems
  const measurePoint2point = new NavbarItem("Point to point", buildTemp);
  measurePoint2point.isExclusive = true;
  const measureObject = new NavbarItem("Object", buildTemp);
  measureObject.isExclusive = true;
  // append subitems
  measure.subitems.push(measurePoint2point, measureObject);

  // Explode
  const explode = new NavbarItem("Explode", buildTemp);
  //// subitems
  const explodeCategory = new NavbarItem("By category", buildTemp);
  explodeCategory.isExclusive = true;
  const explodeLevel = new NavbarItem("By level", buildTemp);
  explodeLevel.isExclusive = true;
  const explodeDiscipline = new NavbarItem("By discipline", buildTemp);
  explodeDiscipline.isExclusive = true;
  const explodeSystem = new NavbarItem("By system", buildTemp);
  explodeSystem.isExclusive = true;
  // append subitems
  explode.subitems.push(explodeCategory, explodeLevel);
  navbarItems.push(explode);

  initializeSidebar();
  initializeNavbar(navbarItems);
}
