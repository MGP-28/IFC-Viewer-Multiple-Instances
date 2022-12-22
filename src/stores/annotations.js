import { getAnnotations } from "../services/getAnnotations";
import { saveToLS } from "../services/localStorage";

const annotations = [];
let id = 0;

// Get saved annotations
const savedData = getAnnotations();

if (savedData !== null) {
  savedData.forEach((annotation) => {
    annotations.push(annotation);
  });

  const maxId = Math.max(...annotations.map((x) => x.id));
  id = maxId;
}

function addAnnotation(newAnnotation) {
  id++;
  const annotation = newAnnotation;
  annotation.id = id;
  annotations.push(annotation);

  // trigger event
  const customEvent = new CustomEvent("newAnnotation", {
    detail: {
      annotation: annotation,
    },
  });
  document.dispatchEvent(customEvent);

  saveToLS("annotations", annotations);

  return annotation.id;
}

function removeAnnotation(id) {
  const ids = annotations.map((sv) => sv.id);
  const idx = ids.indexOf(id);
  if (idx == -1) return;
  annotations.splice(idx, 1);
  // trigger event
  const customEvent = new CustomEvent("updateAnnotationsList", {
    detail: {
      removedId: id,
    },
  });
  document.dispatchEvent(customEvent);

  saveToLS("annotations", annotations);
}

function getAnnotationsFromSavedView(savedViewId) {
  const arr = annotations.filter((x) => x.id == savedViewId);
  return arr;
}

export {
  annotations,
  addAnnotation,
  removeAnnotation,
  getAnnotationsFromSavedView,
};
