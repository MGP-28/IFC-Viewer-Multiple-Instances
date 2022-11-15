import { IFCLoader } from "web-ifc-three/IFCLoader";
import * as Stored from "../stores/scene.js";
import * as Models from "../stores/models.js";

export default function loadModels(event) {
    
  const _ifcLoaders = [];

  for (let idx = 0; idx < event.target.files.length; idx++) {

    const ifcURL = URL.createObjectURL(event.target.files[idx]);
    // console.log(event.target.files[idx])
    const ifcLoader = new IFCLoader();
    ifcLoader.load(ifcURL, (ifcModel) => {
      Models.ifcModels.push(ifcModel);
      Stored.scene.add(ifcModel);
    });
    _ifcLoaders.push(ifcLoader);
  }

  // Async function to check if models are loaded every second. Doesn't interrupt application flow
  waitLoad();

  function waitLoad() {
    if (event.target.files.length > Models.ifcModels.length) {
      setTimeout(() => {
        waitLoad();
      }, 1000);
    } else {
      reorderArrays();
    }
  }

  function reorderArrays() {
    // console.log('rawLoaders', _ifcLoaders)
    for (let idx = 0; idx < Models.ifcModels.length; idx++) {
      // console.log('cycling')
      const correspondingLoader = _ifcLoaders.find(
        (x) => Models.ifcModels[idx].uuid == x.ifcManager.state.models[0].mesh.uuid
      );
      Models.ifcLoaders.push(correspondingLoader);
    }
    // console.log('models', ifcModels)
    // console.log('loaders', ifcLoaders)
  }
}
