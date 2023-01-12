import initializeNavbar from "./navbar";
import initializeSidebar from "./sidebar";
import NavbarItem from "../../models/navbar/NavbarItemData";
import { createElement } from "../../helpers/generic/domElements";
import { navbarItems } from "../../stores/navbarItems";
import * as ClippingPlanes from "./clippingPlanes";
import * as SavedViews from "./savedViews";
import * as Annotations from "./annotations";
import * as SpatialTree from "./spatialTree";

export default async function startFeatures() {
  //// Temporary, for testing
  const buildTemp = (item) => createElement("span", { textContent: item.title });

  // Window (Selection tree, Properties)
  const window = new NavbarItem("Window", buildTemp);
  //// subitems
  const selectionTree = new NavbarItem("Selection Tree", SpatialTree.build);
  selectionTree.sidebarPosition = "l1";
  const properties = new NavbarItem("Properties", buildTemp);
  properties.sidebarPosition = "l2";
  // append subitems
  window.subitems.push(selectionTree, properties);
  navbarItems["window"] = window;

  // Visibility
  const visibility = new NavbarItem("Visibility", buildTemp);
  //// subitems
  const views = new NavbarItem("Views", SavedViews.build, SavedViews.load, SavedViews.unload);
  views.sidebarPosition = "r1";
  const annotations = new NavbarItem("Annotations", Annotations.build, Annotations.load, Annotations.unload);
  annotations.sidebarPosition = "r2";
  // append subitems
  visibility.subitems.push(views, annotations);
  navbarItems["visibility"] = visibility;

  // Clipping planes
  const clippingPlanes = new NavbarItem("Clipping planes", ClippingPlanes.build, ClippingPlanes.load, ClippingPlanes.unload);
  navbarItems["clippingPlanes"] = clippingPlanes;

  // Measure
  const measure = new NavbarItem("Measure", buildTemp);
  //// subitems
  const measurePoint2point = new NavbarItem("Point to point", buildTemp);
  measurePoint2point.isExclusive = true;
  const measureObject = new NavbarItem("Object", buildTemp);
  measureObject.isExclusive = true;
  // append subitems
  measure.subitems.push(measurePoint2point, measureObject);
  navbarItems["measure"] = measure;

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
  navbarItems["explode"] = explode;

  document.addEventListener("wereReady", () => {
    selectionTree.build();
  })
  
  initializeSidebar();
  initializeNavbar();
}
