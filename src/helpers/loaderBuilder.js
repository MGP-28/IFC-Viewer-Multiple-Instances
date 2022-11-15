import {
    acceleratedRaycast,
    computeBoundsTree,
    disposeBoundsTree
  } from 'three-mesh-bvh';

export default function setupLoader(ifcLoader){
    ifcLoader.ifcManager.setupThreeMeshBVH(
        computeBoundsTree,
        disposeBoundsTree,
        acceleratedRaycast
    );
}