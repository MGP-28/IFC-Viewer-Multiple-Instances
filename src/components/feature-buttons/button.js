import { buildIcon } from "../generic/icon";

function featureButton(iconName, prompt) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("feature-button", "not-ready");
  wrapper.title = prompt

  const icon = buildIcon(iconName);
  wrapper.appendChild(icon);

  return wrapper;
}

export { featureButton };
