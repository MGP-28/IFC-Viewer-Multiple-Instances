// import { createElement } from "../../helpers/generic/domElements";
// import { renderMainSidebar } from "../sidebar/sidebar";
// import startPropertiesFeature from "./properties";
// import startSpatialTree from "./spatialTree";

// export default async function startFeatureSidebar() {
//   // const result = await startSpatialTree();
//   // return result;

//   renderMainSidebar();

//   return;

//   const featuresContainer = createElement("div", {
//     classes: ["tools-side-content"],
//   });

//   const propertiesFeature = startPropertiesFeature();
//   featuresContainer.appendChild(propertiesFeature);
//   const spatialTreeFeature = await startSpatialTree();
//   featuresContainer.appendChild(spatialTreeFeature);

//   const toolsContainer = createElement("div", {
//     classes: ["tools-side-container"],
//   });
//   toolsContainer.appendChild(featuresContainer);

//   document.body.appendChild(toolsContainer);
// }
