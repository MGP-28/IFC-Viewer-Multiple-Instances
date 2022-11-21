// Model class instances
let models = [];
const addModel = (model) => models.push(model);
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

  if(!AllCategoriesLoaded) getAllCategoriesOfAllModels();
  return AllCategoriesLoaded;
}

const getAllCategoriesOfAllModels = () => {
  if (AllCategoriesLoaded) return;
  let _allCategoriesLoaded = [];
  for (let idx = 0; idx < models.length; idx++) {
    const categoriesModel = getAllCategoriesOfAModel(idx);
    _allCategoriesLoaded.concat(categoriesModel);
  }
  AllCategoriesLoaded = new Set(_allCategoriesLoaded);
};

const getAllCategoriesOfAModel = (modelID) => {
  // Array to return with categories' names
  const categoriesModel = [];

  const levels = models[modelID].levels;
  // Cycle levels of a model
  for (let idx = 0; idx < levels.length; idx++) {
    const level = levels[idx];
    const categoriesByLevel = level.categories;
    // Cycle each category in a level
    for (let idx = 0; idx < categoriesByLevel.length; idx++) {
      const categoryByLevel = categoriesByLevel[idx];
      categoriesModel.push(categoryByLevel.name);
    }
  }

  return categoriesModel;
};

export {
  models,
  addModel,
  resetModels,
  isAllModelsLoaded,
  getAllCategoriesLoaded,
  getAllCategoriesOfAModel
};
