import Annotation from "../models/Annotation";
import { loadFromLS } from "./localStorage";
import { convertJSONToVector } from "../helpers/generic/vectors";

function getAnnotations() {
  const LSData = loadFromLS("annotations");
  if (LSData) {
    const results = [];
    LSData.forEach((element) => {
      const annotation = new Annotation();
      annotation.id = element.id;
      annotation.viewId = element.viewId;
      annotation.categoryId = element.categoryId;
      annotation.content = element.content;
      annotation.userId = element.userId;
      annotation.position = convertJSONToVector(element.position).clone();
      results.push(annotation);
    });
    return results;
  }
  return null;
}

export { getAnnotations };
