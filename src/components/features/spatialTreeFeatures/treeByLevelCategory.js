import { emitGlobalEvent } from "../../../helpers/emitEvent";
import { createElement } from "../../../helpers/generic/domElements";
import { objectsData } from "../../../stores/renderObjects";
import getNodePropertyName from "../../../helpers/getNodePropertyName";

function render() {
  emitGlobalEvent("loading");

  const element = createElement("div", {
    classes: ["spatial-tree-byCategory"],
  });

  const objects = Array.from(objectsData);

  const levels = objects.reduce((acc, x) => {
    if (acc.findIndex((y) => y.modelIdx == x.modelIdx && y.levelId == x.levelId) === -1) {
      acc.push({
        modelIdx: x.modelIdx,
        levelId: x.levelId,
      });
    }
    return acc;
  }, []);

  levels.forEach(async (level) => {
    level.name = await getNodePropertyName({ expressID: level.levelId }, level.modelIdx);
  });

  let id = undefined;
  id = setInterval(() => {
    const levelNames = levels.map((x) => x.name);
    if ([levelNames].includes(null)) return;

    // Send data to be processed in web worker
    worker({ objects, levels });

    clearInterval(id);
  }, 100);

  function worker(data) {
    const worker = new Worker("/src/tools/workers/spatialTree/byLevelByCategory.js", { type: "module" });
    worker.postMessage(data);
    worker.onerror = (event) => {
      console.log("There is an error with your worker!");
    };
    worker.onmessage = (e) => {
      const objectsByLevelByCategory = e.data;

      //

      emitGlobalEvent("loadingComplete");

      worker.terminate();
    };
  }

  return element;
}

export { render as renderSpatialTreeByLevelCategory };
