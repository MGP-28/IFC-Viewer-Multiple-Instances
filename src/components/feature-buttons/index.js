import { emitEventOnElement } from "../../helpers/emitEvent";
import renderAnnotationsFeature from "./annotations";
import { featureButton } from "./button";
import renderClippingPlanesFeature from "./clippingPlanes";
import renderHelperFeature from "./help";
import renderSavedViewsFeature from "./savedViews";

export default function startFeatureButtons() {
  const wrapper = document.createElement("div");

  // Add features

  wrapper.appendChild(renderClippingPlanesFeature());
  wrapper.appendChild(renderSavedViewsFeature());
  wrapper.appendChild(renderAnnotationsFeature());

  // dummies
  for (let idx = 0; idx < 2; idx++) {
    const dummy = dummyFeature();
    wrapper.appendChild(dummy);
  }

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
