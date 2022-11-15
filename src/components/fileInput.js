import loadModels from "../helpers/loadModels";
import { input } from "../stores/view";

export default function startInput() {

  input.addEventListener(
    "change",
    (event) => loadModels(event),
    false
  );
  
}
