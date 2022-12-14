import clipping from "../../helpers/clippingPlanes";
import { models } from "../../stores/models";
import { userInteractions } from "../../stores/userInteractions";
import { featureButton } from "./button";

export default function renderClippingPlanesFeature() {
  const element = featureButton("cube-04", "Clipping planes");

  let isEnabled = false;

  element.addEventListener("startFeature", (e) => {
    element.addEventListener("click", (e) => {
      isEnabled = !isEnabled;
      userInteractions.clippingPlanes = isEnabled;
      clipping(isEnabled);
      element.classList.toggle("active");
    });
  });

  return element;
}
