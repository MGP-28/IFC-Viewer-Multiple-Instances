import { emitEventOnElement } from "../../helpers/emitEvent";
import { featureButton } from "./button";
import renderClippingPlanesFeature from "./clippingPlanes";

export default function startFeatureButtons() {
  const wrapper = document.createElement("div");

  wrapper.appendChild(renderClippingPlanesFeature());

  // dummies
  for (let idx = 0; idx < 4; idx++) {
    wrapper.appendChild(dummyFeature());
  }
  
  wrapper.classList.add("features-floating-buttons");

  document.body.appendChild(wrapper);

  // Enable buttons when ready
  document.addEventListener("startFeatures", async (event) => {
    for (let idx = 0; idx < wrapper.childNodes.length; idx++) {
      const element = wrapper.children[idx];
      console.log('el', element)
      element.classList.remove("not-ready");
      emitEventOnElement(element, "startFeature");
    }
  });
}

function dummyFeature(){
  const element = featureButton("x", "Tester");

  element.addEventListener("startFeature", (e) => {
    element.addEventListener("click", (e) => {
      element.classList.toggle("active");
    });
  });

  return element
}
