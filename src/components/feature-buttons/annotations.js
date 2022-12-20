import { icons } from "../../configs/icons";
import { userInteractions } from "../../stores/userInteractions";
import { featureButton } from "./button";

export default function renderAnnotationsFeature() {
  const element = featureButton(icons.annotations, "Annotations");

  let isEnabled = false;

  element.addEventListener("startFeature", (e) => {
    element.addEventListener("click", (e) => {
      isEnabled = !isEnabled;
      userInteractions.annotations = isEnabled;
      element.classList.toggle("active");

      //helper function

    });
  });

  return element;
}
