import * as SceneStore from "../../stores/scene";

function testShape() {
  const geometryTest = new THREE.SphereGeometry(0.5, 32, 16);
  const materialTest = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const circleTest = new THREE.Mesh(geometryTest, materialTest);
  circleTest.position.x = 0;
  circleTest.position.y = 0;
  circleTest.position.z = 0;
  SceneStore.scene.add(circleTest);
}

export { testShape };
