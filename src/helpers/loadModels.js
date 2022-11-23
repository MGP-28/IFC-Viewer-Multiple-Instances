import * as Scene from "../stores/scene.js";
import * as Models from "../stores/models.js";
import Model from "../models/Model.js";
import { getAllSpacialTrees } from "./spatialTree.js";
import emitGlobalEvent from "./emitEvent.js";
import { setupLoader, setMatrix } from "./builders/loaderBuilder.js";
import * as THREE from "three";

export default async function loadModels(event) {
  emitGlobalEvent("loading");

  const _ifcLoaders = [];

  for (let idx = 0; idx < event.target.files.length; idx++) {
    const isFirst = idx == 0;

    const ifcURL = URL.createObjectURL(event.target.files[idx]);

    const modelInstance = new Model();
    Models.addModel(modelInstance);

    const ifcLoader = await setupLoader(isFirst);

    const loadedModel = await ifcLoader.loadAsync(ifcURL);

    if (isFirst) {
      const matrixArr = await ifcLoader.ifcManager.ifcAPI.GetCoordinationMatrix(
        0
      );
      const matrix = new THREE.Matrix4().fromArray(matrixArr);
      setMatrix(matrix);
    }

    modelInstance.model = loadedModel;

    // Scene.scene.add(loadedModel); // To be replaced by level/category loading

    _ifcLoaders.push(ifcLoader);
  }

  // Async function to check if models are loaded every second. Doesn't interrupt application flow
  waitLoad();

  async function waitLoad() {
    if (!Models.isAllModelsLoaded()) {
      setTimeout(() => {
        waitLoad();
      }, 1000);
    } else {
      reorderArrays();
      const result = await getAllSpacialTrees();

      if (result) emitGlobalEvent("wereReady");
    }
  }

  function reorderArrays() {
    for (let idx = 0; idx < Models.models.length; idx++) {
      const modelUUID = Models.models[idx].model.uuid;
      const correspondingLoader = _ifcLoaders.find(
        (x) => modelUUID == x.ifcManager.state.models[0].mesh.uuid
      );
      Models.models[idx].loader = correspondingLoader;
    }
  }
}
