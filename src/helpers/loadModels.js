import { IFCLoader } from "web-ifc-three/IFCLoader";
import * as Scene from "../stores/scene.js";
import * as Models from "../stores/models.js";
import Model from "../models/Model.js";
import { getAllSpacialTrees } from "./spatialTree.js";

export default function loadModels(event) {
    
  const _ifcLoaders = [];

  for (let idx = 0; idx < event.target.files.length; idx++) {

    const ifcURL = URL.createObjectURL(event.target.files[idx]);
    
    const model = new Model();
    Models.addModel(model);

    const ifcLoader = new IFCLoader();

    ifcLoader.load(ifcURL, (loadedModel) => {
      Scene.scene.add(loadedModel);
      model.model = loadedModel;
    });

    _ifcLoaders.push(ifcLoader);
  }

  // Async function to check if models are loaded every second. Doesn't interrupt application flow
  waitLoad();

  function waitLoad() {
    if (!Models.isAllModelsLoaded()) {
      setTimeout(() => {
        waitLoad()
      }, 1000);
    } else {
      reorderArrays()
      getAllSpacialTrees()
      //
    }
  }

  function reorderArrays() {
    for (let idx = 0; idx < Models.models.length; idx++) {
      const correspondingLoader = _ifcLoaders.find(
        (x) => Models.models[idx].model.uuid == x.ifcManager.state.models[0].mesh.uuid
      );
      Models.models[idx].loader = correspondingLoader
    }
  }
}