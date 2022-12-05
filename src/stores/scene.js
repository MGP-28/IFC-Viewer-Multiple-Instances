// import * as SubsetBuilder from "../helpers/subsetBuilder";
// import * as Models from "./models";

//Sets up the renderer, fetching the canvas of the HTML
const threeCanvas = document.getElementById("three-canvas");

let scene = undefined;
const setScene = (value) => (scene = value);

let camera = undefined;
const setCamera = (value) => (camera = value);

let controls = undefined;
const setControls = (value) => (controls = value);

export { threeCanvas, scene, setScene, camera, setCamera, controls, setControls };
