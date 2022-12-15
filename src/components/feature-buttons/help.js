import { HelperTips, HelperHeader } from "../../configs/helper";
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
    <div class="feature-helper-wrapper">
        <div class="feature-helper-wrapper-buffer">
            <div class="feature-helper-container">
            </div>
        </div>
    </div>
  `;
  const wrapper = popup.getElementsByClassName("feature-helper-wrapper")[0];
  const container = popup.getElementsByClassName("feature-helper-container")[0];

  // Header
  const header = buildHeader();
  // inserts node on top
  wrapper.insertBefore(header, wrapper.firstChild);

  // Content
  for (const feature in HelperTips) {
    const tip = HelperTips[feature];
    const tipEl = buildTip(tip);
    container.appendChild(tipEl);
    const seperator = buildSeperator();
    container.appendChild(seperator);
  }
  // remove last seperator
  container.lastChild.remove();

  const closer = header.getElementsByClassName(
    "feature-helper-header-close"
  )[0];

  let isEnabled = false;

  // event handling for opening/closing feature
  stateHandling([element, popup, closer]);

  wrapper.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.body.appendChild(popup);

  return element;

  // In-scope aux functions
  function stateHandling(stateTogglers) {
    stateTogglers.forEach((element) => {
      element.addEventListener("click", (e) => {
        toggleState();
      });
    });
  }

  function toggleState() {
    isEnabled = !isEnabled;
    popup.classList.toggle("hidden");
    element.classList.toggle("active");
  }
}

function buildHeader() {
  const header = createElement("div", {
    classes: ["feature-helper-header"],
  });
  header.innerHTML = `
    <div class="feature-helper-header-text">${HelperHeader.title}</div>
    <div class="feature-helper-header-subtitle">${HelperHeader.description}</div>
    `;

  // add icons
  const icon = buildIcon(HelperHeader.icon);
  icon.classList.add("feature-helper-header-icon");
  header.insertBefore(icon, header.firstElementChild);

  const close = buildIcon(icons.close);
  close.classList.add("feature-helper-header-close");
  header.insertBefore(close, header.lastElementChild);

  return header;
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
