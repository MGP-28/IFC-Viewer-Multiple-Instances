import { emitGlobalEvent } from "../../../helpers/emitEvent";
import { createElement } from "../../../helpers/generic/domElements";
import { objectsData } from "../../../stores/renderObjects";
import getNodePropertyName from "../../../helpers/getNodePropertyName";
import { buildTree } from "./tree";

function render() {
  emitGlobalEvent("loading");

  const element = createElement("ul", {
    classes: ["tree-wrapper"],
  });

  setTimeout(async () => {
    const objects = Array.from(objectsData);

    const levels = objects.reduce((_levels, obj) => {
      // If object's level is not in the levels array, push it
      if (_levels.findIndex((level) => level.modelIdx == obj.modelIdx && level.expressId == obj.levelId) === -1) {
        _levels.push({
          modelIdx: obj.modelIdx,
          expressId: obj.levelId,
        });
      }
      return _levels;
    }, []);

    // Build array of promises to get levels' names
    const getNames = levels.map(async (level) => await getNodePropertyName(level));
    // Resolve promises and get names, in the order as levels[], and assign each name to its corresponding level
    Promise.all(getNames)
      .then((names) =>
        levels.map(({ expressId, modelIdx }, idx) => {
          return { name: names[idx], expressId, modelIdx };
        })
      )
      .then((namedLevels) => worker({ objects, levels: namedLevels }));

    function worker(data) {
      const worker = new Worker("/src/tools/workers/spatialTree/byLevelByCategory.js", { type: "module" });
      worker.postMessage(data);
      worker.onerror = (event) => {
        console.log("There is an error with your worker!");
      };
      worker.onmessage = async (e) => {
        const tree = e.data;

        console.log("objectsByLevelByCategory", tree);

        emitGlobalEvent("loadingComplete");

        await buildTree(element, tree);

        worker.terminate();
      };
    }
  }, 1);

  return element;
}

export { render as renderSpatialTreeByLevelCategory };
