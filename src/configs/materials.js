import UIConfigs from "./ui";
import { MeshBasicMaterial } from "three";

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
    color: parseInt(UIConfigs.primaryColorLight, 16),
    depthTest: false,
  },
};

// Creates subset material
const materials = {};
for (const key in defaultValues) {
  materials[key] = new MeshBasicMaterial({
    transparent: defaultValues[key].transparent,
    opacity: defaultValues[key].opacity,
    color: defaultValues[key].color,
    depthTest: defaultValues[key].depthTest,
  });
}
console.log('materials', materials)

export { materials, defaultValues };
