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

    Scene.scene.add(loadedModel);
    modelInstance.model = loadedModel;

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

      //
      //
      // document.addEventListener("wereReady", () => {
      //   function distanceVector(v1, v2) {
      //     var dx = v1.x - v2.x;
      //     var dy = v1.y - v2.y;
      //     var dz = v1.z - v2.z;

      //     return Math.sqrt(dx * dx + dy * dy + dz * dz);
      //   }

      //   console.log(Models.models[0].loader);

      //   const baseModel = Models.models[0].model;
      //   baseModel.geometry.computeBoundingBox(); // otherwise geometry.boundingBox will be undefined

      //   var boundingBox = baseModel.geometry.boundingBox.clone();
      //   const center = new THREE.Vector3();
      //   boundingBox.getCenter(center);
      //   Scene.scene.add(boundingBox);
      //   console.log(center);

      //   const geometry = new THREE.BoxGeometry(1, 1, 1);
      //   const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      //   const cube = new THREE.Mesh(geometry, material);
      //   cube.position.addScaledVector(center, 1);
      //   Scene.scene.add(cube);
      //   new Scene();

      //   Scene.scene.translateX(-center.x);
      //   Scene.scene.translateY(-center.y);
      //   Scene.scene.translateZ(-center.z);

      //   const secondModel = Models.models[1].model;
      //   secondModel.geometry.computeBoundingBox(); // otherwise geometry.boundingBox will be undefined
      //   var boundingBox = baseModel.geometry.boundingBox.clone();
      //   const center2 = new THREE.Vector3();
      //   boundingBox.getCenter(center2);

      //   const distance = distanceVector(new Vector3(), center)
      //   const vector = center
      //   vector.negate();

      //   baseModel.translateOnAxis(vector, distance);
      // });
      //
      //
      //

      if (result) emitGlobalEvent("wereReady");
    }
  }

  function reorderArrays() {
    for (let idx = 0; idx < Models.models.length; idx++) {
      const correspondingLoader = _ifcLoaders.find(
        (x) =>
          Models.models[idx].model.uuid ==
          x.ifcManager.state.models[0].mesh.uuid
      );
      Models.models[idx].loader = correspondingLoader;
    }
  }
}
