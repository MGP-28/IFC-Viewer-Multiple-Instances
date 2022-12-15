let id = 0;
const savedViews = {};

function addSavedView(newSavedView){
    id++;
    savedViews[id] = newSavedView;
}

export { savedViews, addSavedView }