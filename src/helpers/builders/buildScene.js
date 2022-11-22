import { LessDepth, Scene } from "three";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Stored from "../../stores/scene";
import Stats from "stats.js/src/Stats";

export default function buildScene() {
  //Start scene in Three
  Stored.setScene(new Scene());

  //Object to store the size of the viewport
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  //Creates the camera (point of view of the user)
  Stored.setCamera(new PerspectiveCamera(75, size.width / size.height));
  Stored.camera.position.z = 15;
  Stored.camera.position.y = 13;
  Stored.camera.position.x = 8;

  //Creates the lights of the scene
  const lightColor = 0xffffff;

  const ambientLight = new AmbientLight(lightColor, 0.5);
  Stored.scene.add(ambientLight);

  const directionalLight = new DirectionalLight(lightColor, 1);
  directionalLight.position.set(0, 10, 0);
  directionalLight.target.position.set(-5, 0, 0);
  Stored.scene.add(directionalLight);
  Stored.scene.add(directionalLight.target);

  const renderer = new WebGLRenderer({
    canvas: Stored.threeCanvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //Creates grids and axes in the scene
  const grid = new GridHelper(50, 30);
  Stored.scene.add(grid);

  const axes = new AxesHelper();
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  Stored.scene.add(axes);

  //Creates the orbit controls (to navigate the scene)
  const controls = new OrbitControls(Stored.camera, Stored.threeCanvas);
  controls.enableDamping = true;
  controls.target.set(-2, 0, 0);

  //Stats debug component
  var stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  //Animation loop
  const animate = () => {
    stats.begin();

    controls.update();
    renderer.render(Stored.scene, Stored.camera);

    stats.end();

    requestAnimationFrame(animate);
  };

  animate();

  //Adjust the viewport to the size of the browser
  window.addEventListener("resize", () => {
    (size.width = window.innerWidth), (size.height = window.innerHeight);
    Stored.camera.aspect = size.width / size.height;
    Stored.camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
  });
}
