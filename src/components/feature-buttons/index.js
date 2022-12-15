import { emitEventOnElement } from "../../helpers/emitEvent";
import { featureButton } from "./button";
import renderClippingPlanesFeature from "./clippingPlanes";

export default function startFeatureButtons() {
  const wrapper = document.createElement("div");

  // Add feature buttons

  wrapper.appendChild(renderClippingPlanesFeature());

  // dummies
  for (let idx = 0; idx < 4; idx++) {
    const dummy = dummyFeature();
    wrapper.appendChild(dummy);
  }

  wrapper.appendChild(renderClippingPlanesFeature());

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
