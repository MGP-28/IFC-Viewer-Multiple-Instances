import { emitEventOnElement } from "../../helpers/emitEvent";
import NavbarItem from "../../models/navbar/NavbarItemData";
import { renderNavbar } from "../navbar/navbar";
import renderAnnotationsFeature from "./annotations";
import { featureButton } from "./button";
import renderClippingPlanesFeature from "./clippingPlanes";
import renderHelperFeature from "./help";
import renderSavedViewsFeature from "./savedViews";

export default function startFeatureButtons() {
  //// For testing
  //

  const items = [
    new NavbarItem("Spatial Tree", true, build),
    new NavbarItem("Visibility", true, build),
    new NavbarItem("Measure", true, build, load, unload),
    new NavbarItem("Clipping Plane", true, build),
    new NavbarItem("Explode", false, build, load, unload),
  ];
  const subitems = [
    new NavbarItem("Exclusive item 1", true, build),
    new NavbarItem("Exclusive item 2", true, build),
    new NavbarItem("Loose item", true, build),
  ];
  subitems[0].isExclusive = true;
  subitems[0].hasSidebarTab = true;
  subitems[1].isExclusive = true;
  subitems[2].isExclusive = false;

  items[0].hasSidebarTab = true;
  items[1].subitems.push(subitems[0]);
  items[1].subitems.push(subitems[1]);
  items[1].subitems.push(subitems[2]);
  items[3].hasSidebarTab = true;

  //
  ////

  renderNavbar(items);

  return;

  function build(navItem) {
    const el = document.createElement("span");
    el.textContent = navItem.title;
    return el;
  }

  function load(navItem) {
    console.log('load', navItem.title);
  }

  function unload(navItem) {
    console.log('unload', navItem.title);
  }

  const wrapper = document.createElement("div");

  // Add features

  wrapper.appendChild(renderClippingPlanesFeature());
  wrapper.appendChild(renderSavedViewsFeature());
  wrapper.appendChild(renderAnnotationsFeature());

  wrapper.appendChild(renderHelperFeature());

  wrapper.classList.add("features-floating-buttons");

  document.body.appendChild(wrapper);

  // Enable buttons when ready
  document.addEventListener("startFeatures", async (event) => {
    for (let idx = 0; idx < wrapper.childNodes.length; idx++) {
      const element = wrapper.children[idx];
      element.classList.remove("not-ready");
      emitEventOnElement(element, "startFeature");
    }
  });
}

function dummyFeature() {
  const element = featureButton("x", "Tester");

  element.addEventListener("startFeature", (e) => {
    element.addEventListener("click", (e) => {
      element.classList.toggle("active");
    });
    element.addEventListener("dblclick", () => {
      element.classList.toggle("not-ready");
    });
  });

  return element;
}
