const savedViews = [];
let id = 0;

function addSavedView(newSavedView) {
  id++;
  const savedView = newSavedView.clone();
  savedView.id = id;
  savedViews.push(savedView);
  return savedView.id;
}

function removeSavedView(id) {
  const ids = savedViews.map((sv) => sv.id);
  const idx = ids.indexOf(id);
  if (idx > -1) savedViews.splice(idx, 1);
}

export { savedViews, addSavedView, removeSavedView };
