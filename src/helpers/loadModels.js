import * as Scene from "../stores/scene.js";
import * as Models from "../stores/models.js";
import Model from "../models/Model.js";
import { getAllSpacialTrees } from "./spatialTree.js";
import emitGlobalEvent from "./emitEvent.js";
import setupLoader from "./builders/loaderBuilder.js";

export default async function loadModels(event) {

  emitGlobalEvent("loading")
    
  const _ifcLoaders = [];

  for (let idx = 0; idx < event.target.files.length; idx++) {

    const ifcURL = URL.createObjectURL(event.target.files[idx]);
    
    const modelInstance = new Model();
    Models.addModel(modelInstance);

    const ifcLoader = await setupLoader(ifcLoader);

    const loadedModel = await ifcLoader.loadAsync(ifcURL)
    Scene.scene.add(loadedModel);
    modelInstance.model = loadedModel;

    // ifcLoader.load(ifcURL, (loadedModel) => {
    //   Scene.scene.add(loadedModel);
    //   modelInstance.model = loadedModel;
    // });

    _ifcLoaders.push(ifcLoader);
  }

  // Async function to check if models are loaded every second. Doesn't interrupt application flow
  waitLoad();

  async function waitLoad() {
    if (!Models.isAllModelsLoaded()) {
      setTimeout(() => {
        waitLoad()
      }, 1000);
    } else {
      reorderArrays()
      const result = await getAllSpacialTrees()
      //
      if(result) emitGlobalEvent("wereReady")
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