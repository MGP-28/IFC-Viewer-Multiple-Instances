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
    (event) => {
      loadModels(event)
      toggleFileInput(input)
    },
    false
  );
  
}

function toggleFileInput(input){
  input.classList.toggle('hidden')
}