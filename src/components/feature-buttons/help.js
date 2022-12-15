import { HelperHeader, HelperTips } from "../../configs/helper";
import { icons } from "../../configs/icons";
import { createElement } from "../../helpers/generic/domElements";
import { buildIcon } from "../generic/icon";
import { buildPopupWithHeader } from "../PopupWithHeader";
import { featureButton } from "./button";

export default function renderHelperFeature() {
  const element = featureButton(icons.helper, "Help");
  element.classList.remove("not-ready");

  const headerProps = {
    title: HelperHeader.title,
    subtitle: HelperHeader.description,
    icon: HelperHeader.icon
  }

  const popup = buildPopupWithHeader(headerProps);

  const container = popup.getElementsByClassName("popup-header-content")[0];
  const content = createElement("div", {
    classes: ["feature-helper-content-container"]
  })
  // Content
  for (const feature in HelperTips) {
    const tip = HelperTips[feature];
    const tipEl = buildTip(tip);
    content.appendChild(tipEl);
    const seperator = buildSeperator();
    content.appendChild(seperator);
  }
  // remove last seperator
  content.lastChild.remove();

  container.appendChild(content);

  // Event handling
  let isEnabled = false;
  // event handling for opening/closing feature
  stateHandling();

  document.body.appendChild(popup);

  return element;

  // aux functions in scope

  function stateHandling(){
    popup.addEventListener("toggle", () => {
        toggleState();
    })
    element.addEventListener("click", () => {
        toggleState();
    })
  }

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

function buildSeperator() {
  const element = createElement("div", {
    classes: ["feature-helper-seperator"],
  });
  return element;
}
