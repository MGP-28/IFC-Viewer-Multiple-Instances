import AnnotationCategory from "../models/AnnotationCategory";
import { loadFromLS } from "./localStorage";

function getAnnotationCategories() {
  const LSData = loadFromLS("annotationCategories");
  if (LSData) {
    const results = [];
    LSData.forEach((element) => {
      const annotationCategory = new AnnotationCategory(
        element.name,
        element.color,
        element.reference
      );
      annotationCategory.id = element.id;
      results.push(annotationCategory);
    });
    return results;
  }
  return null;
}

export { getAnnotationCategories };
