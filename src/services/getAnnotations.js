import Annotation from "../models/Annotation";
import { loadFromLS } from "./localStorage";
import * as THREE from "three";

function getAnnotations() {
  const LSData = loadFromLS("annotations");
  if (LSData) {
    const results = [];
    LSData.forEach((element) => {
      const annotation = new Annotation();
      //    annotation.camera.position = convertJSONToVector(element.camera.position).clone();
      //    annotation.camera.pointLookedAt = convertJSONToVector(element.camera.pointLookedAt).clone();
      //    annotation.clipping.min = convertJSONToVector(element.clipping.min).clone();
      //    annotation.clipping.max = convertJSONToVector(element.clipping.max).clone();
      //    annotation.id = element.id;
      //    annotation.note = element.note;
      results.push(annotation);
    });
    return results;
  }
  return null;
}

export { getAnnotations };
