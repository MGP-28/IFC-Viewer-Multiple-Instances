import { getAnnotations } from "../services/getAnnotations";
import { saveToLS } from "../services/localStorage";

const annotations = [];
let id = 0;
let activeId = undefined;

const savedData = getAnnotations();

if(savedData !== null) {
  savedData.forEach(annotation => {
    annotations.push(annotation)
  });
  
  const maxId = Math.max(...annotations.map(x => x.id))
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
  const element = document.getElementById("annotations-list");
  element.dispatchEvent(customEvent);

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
  const element = document.getElementById("annotations-list");
  element.dispatchEvent(customEvent);

  saveToLS("annotations", annotations);
}

function getActiveId() {
  return activeId;
}

function setActiveId(id) {
  activeId = id;
  // trigger event
  dispatchActiveIdChanges();
}

function removeActiveId() {
  activeId = undefined;
  // trigger event
  dispatchActiveIdChanges();
}

function dispatchActiveIdChanges() {
  // trigger event
  const event = new Event("savedViewChanged");
  const element = document.getElementById("annotations-list");
  element.dispatchEvent(event);
}

export {
  annotations,
  addAnnotation,
  removeAnnotation,
  getActiveId,
  setActiveId,
  removeActiveId,
};
