import * as SceneStore from "../../stores/scene";
import * as THREE from 'three'

function testShape(position, color) {
  const geometryTest = new THREE.SphereGeometry(0.5, 32, 16);
  const materialTest = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
    opacity: 0.3
  });
  const circleTest = new THREE.Mesh(geometryTest, materialTest);
  circleTest.position.x = position.x;
  circleTest.position.y = position.y;
  circleTest.position.z = position.z;
  SceneStore.scene.add(circleTest);
}

export { testShape };
