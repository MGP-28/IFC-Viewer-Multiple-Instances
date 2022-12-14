import clipping from "../../helpers/clippingPlanes";
import { models } from "../../stores/models";
import { userInteractions } from "../../stores/userInteractions";

export default function renderClippingPlanesFeature() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button>Clipping planes</button>
  `;
  const btn = wrapper.getElementsByTagName("button")[0];
  let isEnabled = false;
  btn.addEventListener("click", (e) => {
    if(models.length == 0) return;
    isEnabled = !isEnabled;
    userInteractions.clippingPlanes = isEnabled;
    clipping(isEnabled);
    //
  });

  return wrapper;
}
