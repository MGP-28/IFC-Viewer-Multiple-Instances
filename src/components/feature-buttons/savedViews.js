import { icons } from "../../configs/icons";
import { toggleSavedViews } from "../../helpers/savedViews";
import { userInteractions } from "../../stores/userInteractions";
import { featureButton } from "./button";

export default function renderSavedViewsFeature() {
  const element = featureButton(icons.savedViews, "Saved Views");

  let isEnabled = false;

  element.addEventListener("startFeature", (e) => {
    element.addEventListener("click", (e) => {
      isEnabled = !isEnabled;
      userInteractions.savedViews = isEnabled;
      toggleSavedViews(isEnabled);
      element.classList.toggle("active");
    });
  });

  return element;
}
