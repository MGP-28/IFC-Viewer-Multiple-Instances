import { ifcCategoryIndex } from "./repositories/categoryIndex";

export default function getCuratedCategoryNameById(id) {
    const category = getCategoryNameById(id);
    if(!category) return false;
    const treatedCategory = category.slice(3);
    return treatedCategory;
}

function getCategoryNameById(id) {
  for (const key in ifcCategoryIndex) {
    if (ifcCategoryIndex[key] == id) return key;
  }
  return false;
}
