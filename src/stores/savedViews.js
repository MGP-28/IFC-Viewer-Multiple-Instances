import { emitCustomGlobalEvent } from "../helpers/emitEvent";
import { getSavedViews } from "../services/getSavedViews";
import { saveToLS } from "../services/localStorage";
import { removeAllAnnotationsOfASavedView } from "./annotations";

const savedViews = [];
let id = 0;
let activeId = 0;

const savedData = getSavedViews();

if (savedData !== null && savedData.length > 0) {
  savedData.forEach((savedView) => {
    savedViews.push(savedView);
  });

  const maxId = Math.max(...savedViews.map((x) => x.id));
  id = maxId;
}

function addSavedView(newSavedView) {
  id++;
  const savedView = newSavedView;
  savedView.id = id;
  savedViews.push(savedView);

  saveToLS("savedViews", savedViews);
  
  // trigger event
  emitCustomGlobalEvent("newSavedView", {
    savedView: savedView,
  })


  return savedView.id;
}

function removeSavedView(id) {
  const ids = savedViews.map((sv) => sv.id);
  const idx = ids.indexOf(id);
  if (idx == -1) return;
  savedViews.splice(idx, 1);
  // trigger event
  const customEvent = new CustomEvent("removedSavedView", {
    detail: {
      removedId: id,
    },
  });
  document.dispatchEvent(customEvent);

  saveToLS("savedViews", savedViews);

  removeAllAnnotationsOfASavedView(id);
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
  activeId = 0;
  // trigger event
  dispatchActiveIdChanges();
}

function dispatchActiveIdChanges() {
  // trigger event
  const event = new Event("savedViewChanged");
  document.dispatchEvent(event);
}

export {
  savedViews,
  addSavedView,
  removeSavedView,
  getActiveId,
  setActiveId,
  removeActiveId,
};
