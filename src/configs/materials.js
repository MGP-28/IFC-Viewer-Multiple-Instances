import UIConfigs from "./ui";
import { MeshBasicMaterial } from "three"

// Creates subset material
export default materials = {
  highlighted: new MeshBasicMaterial({
    transparent: true,
    opacity: 0.5,
    color: parseInt(UIConfigs.baseColor, 16),
    depthTest: false,
  }),
  selected: new MeshBasicMaterial({
    transparent: true,
    opacity: 0.9,
    color: parseInt(UIConfigs.baseColor, 16),
    depthTest: false,
  }),
};
