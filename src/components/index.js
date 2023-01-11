import startInput from "./fileInput.js";
import startUserInputs from "./events/userInputs.js";
import startRenderingEvents from "./events/viewerRenderingEvents.js";
import startLoadingPopup from "./loading.js";
import startTimer from "./events/timer.js";
import startFeatures from "./features/index.js";

export default function render() {
  startLoadingPopup();
  startInput();
  startUserInputs();
  startTimer();
  startRenderingEvents();
  //startObjectDetail();
  startFeatures();
}
