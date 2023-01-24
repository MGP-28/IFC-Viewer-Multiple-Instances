import { getAnnotationsFromSavedView } from "../stores/annotations";
import { renderAnnotationGroup } from "../components/annotation/annotationGroup";
import { savedViews } from "../stores/savedViews";
import { createElement } from "./generic/domElements";

function renderAnnotations() {
  // content
  const contentEl = createElement("div", {
    classes: ["annotations-wrapper"],
  });

  // list
  const list = createElement("ul", {
    classes: ["annotations-list"],
    id: "annotations-list",
  });
  contentEl.appendChild(list);
  // add loaded views
  //// global view
  const globalView = {
    id: 0,
    note: "Global",
  };
  renderListItem(globalView);
  //// for each saved view
  for (let idx = 0; idx < savedViews.length; idx++) {
    const savedView = savedViews[idx];
    renderListItem(savedView);
  }

  function renderListItem(savedView) {
    const annotations = getAnnotationsFromSavedView(savedView.id);
    const annotationCategoryEl = renderAnnotationGroup(savedView, annotations, list);
    list.appendChild(annotationCategoryEl);
  }

  // events
  handleEvents();

  return contentEl;

  function handleEvents() {
    document.addEventListener("newSavedView", (e) => {
      const savedView = e.detail.savedView;
      renderListItem(savedView);
    });
  }
}

export { renderAnnotations };
