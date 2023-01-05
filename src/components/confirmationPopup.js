import { icons } from "../configs/icons";
import { emitCustomEventOnElement } from "../helpers/emitEvent";
import { buildPopupWithHeader } from "./PopupWithHeader";

/**
 *
 * @param {*} popupProps title, subtitle, message, affirmativeText, negativeText
 */
function render(props, isWarning) {
  const { title, subtitle } = props;
  const icon = icons.helper;

  const popupProps = {
    title,
    subtitle,
    icon,
  };

  const classes = {
    affirmative: !isWarning ? "confirm" : "reject",
    negative: !isWarning ? "reject" : "cancel",
  };

  const popup = buildPopupWithHeader(popupProps);
  popup.classList.remove("hidden");

  const container = popup.getElementsByClassName("popup-header-content")[0];

  container.innerHTML = `
    <div class="confirmation-popup-wrapper">
        <span>${props.message}</span>
        <div class="${classes.affirmative}">${props.affirmativeText}</div>
        <div class="${classes.negative}">${props.negativeText}</div>
    </div>
  `;

  handleEvents();

  return popup;

  function handleEvents() {
    popup.addEventListener("toggle", () => {
      popup.remove();
    });

    container.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    const btnAffirmative = container.getElementsByClassName(
      classes.affirmative
    )[0];
    const btnNegative = container.getElementsByClassName(classes.negative)[0];
    btnAffirmative.addEventListener("click", (e) => {
      emitActionToParent(true);
    });

    btnNegative.addEventListener("click", (e) => {
      emitActionToParent(false);
    });

    function emitActionToParent(result) {
      emitCustomEventOnElement(popup, "confirmationResult", { result });
    }
  }
}

export { render as renderConfirmationPopup };
