import UIConfigs from "./ui";
import { MeshBasicMaterial } from "three"

// Creates subset material
export default materials = {
  highlighted: new MeshBasicMaterial({
    transparent: true,
    opacity: 1,
    color: parseInt(UIConfigs.primaryColorLight, 16),
    depthTest: false,
  }),
  selected: new MeshBasicMaterial({
    transparent: true,
    opacity: 1,
    color: parseInt(UIConfigs.primaryColorDark, 16),
    depthTest: false,
  }),
};
