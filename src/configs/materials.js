import UIConfigs from "./ui";
import * as THREE from "three";

// Set values
const defaultValues = {
  highlighted: {
    transparent: true,
    opacity: 0.6,
    color: parseInt(UIConfigs.primaryColorLight, 16),
    depthTest: false,
  },
  selected: {
    transparent: true,
    opacity: 0.8,
    color: parseInt(UIConfigs.primaryColor, 16),
    depthTest: false,
  },
  clipping: {
    transparent: true,
    opacity: 0.2,
    color: parseInt(UIConfigs.primaryColor, 16),
    depthTest: false,
  },
  transparent: {
    transparent: true,
    opacity: 0.1,
    color: 0x000000,
    depthTest: false,
  },
  planeStencilMat: {
    color: 0x888888,
    stencilWrite: true,
    stencilRef: 0,
    stencilFunc: THREE.NotEqualStencilFunc,
    stencilFail: THREE.ReplaceStencilOp,
    stencilZFail: THREE.ReplaceStencilOp,
    stencilZPass: THREE.ReplaceStencilOp,
  },
  frontFaceStencilMat: {
    depthWrite: false,
    depthTest: false,
    colorWrite: false,
    stencilWrite: true,
    stencilFunc: THREE.AlwaysStencilFunc,
    side: THREE.FrontSide,
    stencilFail: THREE.DecrementWrapStencilOp,
    stencilZFail: THREE.DecrementWrapStencilOp,
    stencilZPass: THREE.DecrementWrapStencilOp,
  },
  backFaceStencilMat: {
    depthWrite: false,
    depthTest: false,
    colorWrite: false,
    stencilWrite: true,
    stencilFunc: THREE.AlwaysStencilFunc,
    side: THREE.BackSide,
    stencilFail: THREE.IncrementWrapStencilOp,
    stencilZFail: THREE.IncrementWrapStencilOp,
    stencilZPass: THREE.IncrementWrapStencilOp,
  },
};

// Creates subset material
const materials = {};
for (const key in defaultValues) {
  const materialData = defaultValues[key];
  materials[key] = new THREE.MeshBasicMaterial(materialData);
}

export { materials, defaultValues };
