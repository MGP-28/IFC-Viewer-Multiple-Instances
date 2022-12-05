// import * as SubsetBuilder from "../helpers/subsetBuilder";
// import * as Models from "./models";

//Sets up the renderer, fetching the canvas of the HTML
const threeCanvas = document.getElementById("three-canvas");

let scene = undefined;

let camera = undefined;

const setScene = (value) => (scene = value);

const setCamera = (value) => (camera = value);

// const removeAllObjectsInScene = () => {
//   for (let idx = 0; idx < Models.models.length; idx++) {
//     const model = Models.models[idx];
//     const ids = model.getAllIDs();
//     SubsetBuilder.removeFromSubset(idx, ids);
//   }
// };

export { threeCanvas, scene, setScene, camera, setCamera, /*removeAllObjectsInScene*/ };
