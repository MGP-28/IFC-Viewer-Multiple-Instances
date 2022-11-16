// Main class for each model loaded into the viewer
//
// loader = IfcLoader instance created for this model
// model = IfcModel created and inserted into the scene
// tree = Spacial tree of the model
// categories [] = Collecton of categories used in the IFC model
// levels [] = Collection of levels used in the IFC model
// subsets [] = Collection of subsets seperated by category and level. See: subset model
// name = Model name

export default class Model {
  constructor() {
    this.loader = undefined;
    this.model = undefined;
    this.tree = undefined;
    this.name = undefined;
  }

  getCategoriesOfModel() {
    const arr = [];
    const levels = getLevelsOfModel();
    // cycle each level
    for (let levelIdx = 0; levelIdx < levels.length; levelIdx++) {
      const children = levels[levelIdx][children];
      // cycle each category in a level
      for (let childIdx = 0; childIdx < children.length; childIdx++) {
        arr.push(children[childIdx].type);
      }
    }
    return new Set(arr);
  }

  getLevelsOfModel() {
    return getNodeByType("IFCBUILDINGSTOREY");
  }
}

function getNodeByType(type, obj) {
  if (obj[type] !== type) {
    const result = getNodeByType(type, obj[children][0]);
    if (result == true) return obj[children];
  } else return true;
}
