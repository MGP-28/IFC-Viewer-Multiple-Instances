import { getAnnotationCategories } from "../services/getAnnotationCategories";
import { saveToLS } from "../services/localStorage";

const annotationCategories = [];
let id = 0;

// Get saved annotationCategoryCategories
const savedData = getAnnotationCategories();

if (savedData !== null) {
  savedData.forEach((annotationCategory) => {
    annotationCategories.push(annotationCategory);
  });

  const maxId = Math.max(...annotationCategories.map((x) => x.id));
  id = maxId;
}

function addAnnotationCategory(newAnnotationCategory) {
  id++;
  const annotationCategory = newAnnotationCategory;
  annotationCategory.id = id;
  annotationCategories.push(annotationCategory);

  // trigger event
  const customEvent = new CustomEvent("newAnnotationCategory", {
    detail: {
      annotationCategory: annotationCategory,
    },
  });
  document.dispatchEvent(customEvent);

  saveToLS("annotationCategories", annotationCategories);

  return annotationCategory.id;
}

function removeAnnotationCategory(id) {
  const ids = annotationCategories.map((sv) => sv.id);
  const idx = ids.indexOf(id);
  if (idx == -1) return;
  annotationCategories.splice(idx, 1);
  // trigger event
  const customEvent = new CustomEvent("updateAnnotationCategoriesList", {
    detail: {
      removedId: id,
    },
  });
  document.dispatchEvent(customEvent);

  saveToLS("annotationCategories", annotationCategories);
}

function getAnnotationCategoryById(categoryId){
  return annotationCategories.find(x => x.id == categoryId)
}

export {
  annotationCategories,
  addAnnotationCategory,
  removeAnnotationCategory,
  getAnnotationCategoryById
};
