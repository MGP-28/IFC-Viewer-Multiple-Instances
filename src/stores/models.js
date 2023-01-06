// Model class instances
let models = [];
const addModel = (model) => {
  models.push(model);
  return models.length - 1;
};
const resetModels = () => (models = []);
function isAllModelsLoaded() {
  for (let idx = 0; idx < models.length; idx++) {
    if (models[idx].model !== undefined) continue;
    else return false;
  }
  return true;
}

// Set of categories used in all models
let AllCategoriesLoaded = undefined;

const getAllCategoriesLoaded = () => {
  if (!AllCategoriesLoaded) {
    let arr = [];
    for (let idx = 0; idx < models.length; idx++) {
      const modelInstance = models[idx];
      const categories = modelInstance.getCategoriesOfModel();
      arr.concat(categories);
    }
    AllCategoriesLoaded = Array.from(new Set(arr));
  }
  return AllCategoriesLoaded;
};

let boundingBox = undefined;
const setBoundingBox = (newBoundingBox) => {
  boundingBox = newBoundingBox;
};

export {
  models,
  addModel,
  resetModels,
  isAllModelsLoaded,
  getAllCategoriesLoaded,
  boundingBox,
  setBoundingBox,
};
