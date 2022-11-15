 //Sets up the renderer, fetching the canvas of the HTML
 const threeCanvas = document.getElementById("three-canvas");

 let scene = undefined;

 let camera = undefined;

 const setScene = (value) => scene = value;

 const setCamera = (value) => camera = value;

 export { threeCanvas, scene, setScene, camera, setCamera }