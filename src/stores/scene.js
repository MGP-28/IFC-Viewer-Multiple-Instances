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

let renderer2D = {
  renderer: undefined,
  group: undefined,
};
const setRenderer2D = (renderer, group) => {
  renderer2D.renderer = renderer;
  renderer2D.group = group;
};

export {
  threeCanvas,
  scene,
  setScene,
  camera,
  setCamera,
  controls,
  setControls,
  renderer2D,
  setRenderer2D,
};
