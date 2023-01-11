import { icons } from "../../configs/icons";
import { clipping } from "../../helpers/clippingPlanes";
import { models } from "../../stores/models";
import { userInteractions } from "../../stores/userInteractions";
import { featureButton } from "../feature-buttons/button";

export default function renderClippingPlanesFeature() {
  const element = featureButton(icons.clipping, "Clipping planes");

  let isEnabled = false;

  element.addEventListener("startFeature", (e) => {
    element.addEventListener("click", (e) => {
      isEnabled = !isEnabled;
      userInteractions.clippingPlanes = isEnabled;
      clipping(isEnabled);
      element.classList.toggle("active");

      if(!isEnabled) userInteractions.clippingPlanes = false;
    });

    document.addEventListener("openClippingPlanes", (e) => {
      if(!isEnabled) element.click();
    })
  });


  return element;
}
