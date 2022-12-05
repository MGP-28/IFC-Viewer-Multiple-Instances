import renderClippingPlanesFeature from "./clippingPlanes";

export default function startFeatureButtons() {
  const wrapper = document.createElement("div");

  wrapper.appendChild(renderClippingPlanesFeature());
  wrapper.classList.add("features-floating-buttons");

  document.body.appendChild(wrapper);
}
