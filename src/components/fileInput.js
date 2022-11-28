import { emitGlobalEvent } from "../helpers/emitEvent";
import loadModels from "../helpers/loadModels";

export default function startInput() {

  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.id = 'file-input'
  input.accept = '.ifc, .ifcXML, .ifcZIP'

  document.body.appendChild(input)

  input.addEventListener(
    "change",
    async (event) => {
      toggleFileInput(input)
      emitGlobalEvent("loading")
      await loadModels(event)
    },
    false
  );
  
}

function toggleFileInput(input){
  input.classList.toggle('hidden')
}