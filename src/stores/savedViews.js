import { getSavedViews } from "../services/getSavedViews";
import { saveToLS } from "../services/localStorage";

const savedViews = [];
let id = 0;
let activeId = undefined;

const savedData = getSavedViews();

if(savedData !== null) {
  savedData.forEach(savedView => {
    savedViews.push(savedView)
  });
  
  const maxId = Math.max(...savedViews.map(x => x.id))
  id = maxId;
}

function addSavedView(newSavedView) {
  id++;
  const savedView = newSavedView;
  savedView.id = id;
  savedViews.push(savedView);

  // trigger event
  const customEvent = new CustomEvent("newSavedView", {
    detail: {
      savedView: savedView,
    },
  });
  const element = document.getElementById("saved-views-list");
  element.dispatchEvent(customEvent);

  saveToLS("savedViews", savedViews);

  return savedView.id;
}

function removeSavedView(id) {
  const ids = savedViews.map((sv) => sv.id);
  const idx = ids.indexOf(id);
  if (idx == -1) return;
  savedViews.splice(idx, 1);
  // trigger event
  const customEvent = new CustomEvent("updateSavedViewsList", {
    detail: {
      removedId: id,
    },
  });
  const element = document.getElementById("saved-views-list");
  element.dispatchEvent(customEvent);

  saveToLS("savedViews", savedViews);
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
  const element = document.getElementById("saved-views-list");
  element.dispatchEvent(event);
}

export {
  savedViews,
  addSavedView,
  removeSavedView,
  getActiveId,
  setActiveId,
  removeActiveId,
};
