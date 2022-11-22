import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import * as THREE from "three";

let matrix = new THREE.Matrix4();

export const setMatrix = (newMatrix) => matrix = newMatrix;

export async function setupLoader(isFirst) {
  const ifcLoader = new IFCLoader();

  ifcLoader.ifcManager.setupThreeMeshBVH(
    computeBoundsTree,
    disposeBoundsTree,
    acceleratedRaycast
  );

  await ifcLoader.ifcManager.applyWebIfcConfig({
    COORDINATE_TO_ORIGIN: isFirst,
    USE_FAST_BOOLS: false,
  });

  if(!isFirst){
    ifcLoader.ifcManager.setupCoordinationMatrix(matrix);
  }

  return ifcLoader;
}
