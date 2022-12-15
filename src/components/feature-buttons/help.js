import { buildModal } from "../generic/modal";
import { featureButton } from "./button";

export default function renderClippingPlanesFeature() {
  const element = featureButton("help-square", "Help");

  
  const popup = buildModal();
  popup.innerHTML = `
  
  `
  
  let isEnabled = false;

  element.addEventListener("startFeature", (e) => {
    element.addEventListener("click", (e) => {
      isEnabled = !isEnabled;
      element.classList.toggle("active");
    });

    
  });

  return element;
}

function buildTip(title, icon, description){

}