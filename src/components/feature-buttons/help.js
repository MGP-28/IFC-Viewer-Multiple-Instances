import { HelperTips } from "../../configs/helper";
import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import { buildIcon } from "../generic/icon";
import { buildModal } from "../generic/modal";
import { featureButton } from "./button";

export default function renderHelperFeature() {
  const element = featureButton(icons.helper, "Help");
  element.classList.remove("not-ready");

  const popup = buildModal();
  popup.innerHTML = `
    <div class="feature-helper-container">
    </div>
  `;
  const container = popup.children[0];

  for (const feature in HelperTips) {
    const tip = HelperTips[feature];
    const tipEl = buildTip(tip);
    container.appendChild(tipEl);
    const seperator = buildSeperator();
    container.appendChild(seperator);
  }
  // remove last seperator
  container.lastChild.remove();

  let isEnabled = false;
  element.addEventListener("click", (e) => {
    toggleState();
  });

  popup.addEventListener("click", (e) => {
    toggleState();
  });
  container.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.body.appendChild(popup);

  return element;

  function toggleState() {
    isEnabled = !isEnabled;
    popup.classList.toggle("hidden");
    element.classList.toggle("active");
  }
}

function buildTip(tip) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("feature-helper-tip-container");

  const icon = buildIcon(tip.icon);
  icon.classList.add("feature-helper-tip-icon");
  wrapper.appendChild(icon);

  const title = createElement("h1", {
    classes: ["feature-helper-tip-title"],
    textContent: tip.title,
  });
  wrapper.appendChild(title);

  const description = createElement("div", {
    classes: ["feature-helper-tip-description"],
  });
  for (let idx = 0; idx < tip.description.length; idx++) {
    const text = tip.description[idx];
    const line = createElement("p", {
      classes: ["feature-helper-tip-description-line"],
      textContent: text,
    });
    description.appendChild(line);
  }
  wrapper.appendChild(description);

  return wrapper;
}

function buildSeperator(){
    const element = createElement("div", {
        classes: ["feature-helper-seperator"]
    })
    return element;
}