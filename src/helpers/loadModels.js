import * as Scene from "../stores/scene.js";
import * as Models from "../stores/models.js";
import Model from "../models/Model.js";
import { getAllSpacialTrees } from "./spatialTree.js";
import emitGlobalEvent from "./emitEvent.js";
import { setupLoader, setMatrix } from "./builders/loaderBuilder.js";
import * as THREE from "three";
import * as RaycastStore from "../stores/raycast.js";

export default async function loadModels(event) {
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
  await waitLoad();

  async function waitLoad() {
    if (!Models.isAllModelsLoaded()) {
      setTimeout(async () => {
        await waitLoad();
      }, 1000);
    } else {
      reorderArrays();
      createSubsets();
      await getAllSpacialTrees();
      emitGlobalEvent("wereReady");
      emitGlobalEvent("startFeatures");
      return true;
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

  function createSubsets() {
    for (let idx = 0; idx < Models.models.length; idx++) {
      createSubset(idx);
    }
  }

  function createSubset(idx) {
    const ids = Models.models[idx].getAllIDs();
    let subset = Models.models[idx].loader.ifcManager.createSubset({
      modelID: 0,
      ids: ids,
      scene: Scene.scene,
      removePrevious: true,
      customID: idx,
    });
    Models.models[idx].subset = subset;
    Scene.scene.add(subset);
    RaycastStore.subsetRaycast.push(subset);
  }
}
