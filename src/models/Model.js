// Main class for each model loaded into the viewer
//
// loader = IfcLoader instance created for this model
// model = IfcModel created and inserted into the scene
// tree = Spacial tree of the model
// levels [] = Array of Level instances used in the IFC model. Contains related categories
// subset = Model collection of objects rendered
//          Remove an object to subset => loader.ifcManager.removeFromSubset(0, [id], customID)
//          Add an object to subset => .loader.ifcManager.createSubset({ (...), removePrevious: false })
// name = Model name

export default class Model {
  constructor() {
    this.loader = undefined;
    this.model = undefined;
    this.tree = undefined;
    this.name = undefined;
    this.subset = undefined;
    this.levels = [];
  }
  addLevel(level) {
    const index = this.levels.findIndex((x) => x.name === level.name);
    if (index == -1) {
      this.levels.push(level);
    } else throw new Error("Level already exists");
  }
  getCategoriesOfModel() {
    const arr = [];
    const categoryBundle = this.levels.map((x) => x.categories);
    for (let idx = 0; idx < categoryBundle.length; idx++) {
      const categoryName = categoryBundle[idx].name;
      arr.push(categoryName);
    }
    return Array.from(new Set(arr));
  }
}
