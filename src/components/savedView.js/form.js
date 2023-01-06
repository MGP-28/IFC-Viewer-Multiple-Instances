import { icons } from "../../configs/icons";
import { buildPopupWithHeader } from "../PopupWithHeader";
import SavedView from "../../models/SavedView";
import { addSavedView, savedViews } from "../../stores/savedViews";
import { getCameraData } from "../../helpers/camera";
import * as ClippingPlanesStore from "../../stores/clippingPlanes";
import { clipping } from "../../helpers/clippingPlanes";

function render() {
  const headerProps = {
    title: "Saving view",
    subtitle: "Creating new saved perspective",
    icon: icons.savedViews,
  };

  //
  // Popup element
  const popup = buildPopupWithHeader(headerProps);

  const container = popup.getElementsByClassName("popup-header-content")[0];

  container.innerHTML = `
    <form class="styling-form">
      <label for="note" class="styling-form-label">Title</label>
      <input type="text" id="saved-view-form-note-input" class="styling-form-input" name="note">
      <span id="styling-form-warning" class="styling-form-warning hidden"></span>
      <input type="submit" value="Save" class="styling-form-submit">
    </form>
  `;

  handleEvents();

  return popup;

  //
  // Aux functions in scope
  //
  function handleEvents() {
    const form = container.getElementsByTagName("form")[0];

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const noteInput = document.getElementById("saved-view-form-note-input");
      const note = noteInput.value;

      // fields incorrectly filled
      if (!note) {
        errorName(true);
        return;
      }

      // fields filled
      const viewsNamesUsed = savedViews.map((x) => x.note);
      const isNameValid = viewsNamesUsed.indexOf(note) == -1;

      if (!isNameValid) {
        errorName(false);
        return;
      }

      saveView(note);

      popup.remove();

      //
      // Aux functions in scope
      //
      function errorName(isEmpty) {
        noteInput.classList.remove("error");
        noteInput.classList.add("error");
        noteInput.addEventListener("focus", classing);

        const message = isEmpty
          ? "Please input a title"
          : "There's already a saved view with the same title!";

        errorMessage(message);

        function classing() {
          noteInput.classList.remove("error");
          noteInput.removeEventListener("focus", classing);
        }
      }

      function errorMessage(message) {
        const errorEl = container.getElementsByClassName(
          "styling-form-warning"
        )[0];
        errorEl.innerHTML = "";
        errorEl.classList.remove("hidden");
        errorEl.textContent = message;
      }
    });

    popup.addEventListener("toggle", () => {
      popup.remove();
    });
  }
}

function saveView(note) {
  const cameraData = getCameraData();
  if (ClippingPlanesStore.visualPlanes.length == 0) {
    // build clipping planes
    clipping(true);
    // disable their render
    clipping(false);
  }
  const clippingData = {
    min: ClippingPlanesStore.edgePositions.currentMin.clone(),
    max: ClippingPlanesStore.edgePositions.currentMax.clone(),
  };
  const savedView = new SavedView(cameraData, clippingData);
  savedView.note = note;
  addSavedView(savedView);
}

export { render as renderNewViewForm };
