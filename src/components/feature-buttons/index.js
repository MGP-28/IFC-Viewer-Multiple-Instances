import { emitEventOnElement } from "../../helpers/emitEvent";
import NavbarItem from "../../models/navbar/NavbarItemData";
import { renderNavbar } from "../navbar/navbar";
import renderAnnotationsFeature from "./annotations";
import { featureButton } from "./button";
import renderClippingPlanesFeature from "./clippingPlanes";
import renderHelperFeature from "./help";
import renderSavedViewsFeature from "./savedViews";

export default function startFeatureButtons() {

  const items = [
    new NavbarItem("Spatial Tree", build),
    new NavbarItem("Visibility", build),
    new NavbarItem("Measure", build),
    new NavbarItem("Clipping Plane", build),
    new NavbarItem("Explode", build),
  ]
  const subitems = [
    new NavbarItem("Subitem", build),
    new NavbarItem("Another subitem", build),
    new NavbarItem("Yet another subitem", build),
  ]

  items[1].subitems.push(subitems[0])
  items[1].subitems.push(subitems[1])
  items[1].subitems.push(subitems[2])

  renderNavbar(items);

  return;

  function build(){
    return document.createElement("span")
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
