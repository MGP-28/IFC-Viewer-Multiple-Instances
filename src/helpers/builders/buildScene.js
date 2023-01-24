import { LessDepth, Scene } from "three";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as SceneStore from "../../stores/scene";
import Stats from "stats.js/src/Stats";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Vector3 } from "three";

export default function buildScene() {
  //Start scene in Three
  SceneStore.setScene(new Scene());

  //Object to store the size of the viewport
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  //Creates the camera (point of view of the user)
  SceneStore.setCamera(new PerspectiveCamera(75, size.width / size.height));
  SceneStore.camera.position.z = 15;
  SceneStore.camera.position.y = 13;
  SceneStore.camera.position.x = 8;

  //Creates the lights of the scene
  const lightColor = 0xffffff;

  const ambientLight = new AmbientLight(lightColor, 0.5);
  SceneStore.scene.add(ambientLight);

  const directionalLight = new DirectionalLight(lightColor, 1);
  directionalLight.position.set(0, 10, 0);
  directionalLight.target.position.set(-5, 0, 0);
  SceneStore.scene.add(directionalLight);
  SceneStore.scene.add(directionalLight.target);

  const renderer = new WebGLRenderer({
    canvas: SceneStore.threeCanvas,
    alpha: true,
    antialias: true,
  });
  renderer.localClippingEnabled = true;
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(size.width, size.height);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  labelRenderer.domElement.style.pointerEvents = "none";
  document.body.appendChild(labelRenderer.domElement);

  const group2D = new Group();
  SceneStore.scene.add(group2D);

  SceneStore.setRenderer2D(labelRenderer, group2D);

  // //Creates grids and axes in the scene
  // const grid = new GridHelper(50, 30);
  // Stored.scene.add(grid);

  // const axes = new AxesHelper();
  // axes.material.depthTest = false;
  // axes.renderOrder = 1;
  // Stored.scene.add(axes);

  //Creates the orbit controls (to navigate the scene)
  const controls = new OrbitControls(SceneStore.camera, SceneStore.threeCanvas);
  controls.enableDamping = false;
  controls.target.set(-2, 0, 0);
  SceneStore.setControls(controls);

  //Stats debug component
  var stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  const statsWindow = stats.dom;
  statsWindow.classList.add("stats");
  document.body.appendChild(statsWindow);

  //Animation loop
  const animate = () => {
    stats.begin();

    cameraFocalPoint();

    controls.update();
    renderer.render(SceneStore.scene, SceneStore.camera);
    labelRenderer.render(SceneStore.scene, SceneStore.camera);

    stats.end();

    requestAnimationFrame(animate);
  };

  /**
   * 
   */
  function cameraFocalPoint() {
    const cameraWorldDir = new Vector3();
    controls.object.getWorldDirection(cameraWorldDir);
    const distance = controls.getDistance();
    if(distance < 2) controls.target.add(cameraWorldDir.multiplyScalar(0.4));
  }

  animate();

  //Adjust the viewport to the size of the browser
  window.addEventListener("resize", () => {
    (size.width = window.innerWidth), (size.height = window.innerHeight);
    SceneStore.camera.aspect = size.width / size.height;
    SceneStore.camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
    labelRenderer.setSize(size.width, size.height);
  });
}
