import UIConfigs from "./ui";
import { MeshBasicMaterial } from "three"

// Creates subset material
export default materials = {
  highlighted: new MeshBasicMaterial({
    transparent: true,
    opacity: 0.6,
    color: parseInt(UIConfigs.primaryColorLight, 16),
    depthTest: false,
  }),
  selected: new MeshBasicMaterial({
    transparent: true,
    opacity: 0.8,
    color: parseInt(UIConfigs.primaryColor, 16),
    depthTest: false,
  }),
};
