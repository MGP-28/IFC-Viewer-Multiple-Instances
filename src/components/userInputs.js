import { pick } from "../helpers/raytracing";

export default function startUserInputs() {

    // Double-click => show details of pointed object
    window.ondblclick = pick;
  
}