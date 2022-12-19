import { icons } from "./icons";

const tips = {
  properties: {
    title: "Properties",
    icon: icons.properties,
    description: [
      "Placeholder text",
      "More placeholder text",
      "Even more placeholder text"
    ],
  },
  spatialTree: {
    title: "Spatial Tree",
    icon: icons.spatialTree,
    description: [
      "Placeholder text",
      "More placeholder text",
      "Even more placeholder text"
    ],
  },
  clipping: {
    title: "Clipping planes",
    icon: icons.clipping,
    description: [
      "Project sized box that can have its faces dragged to cut the presented models",
      "Drag faces with the mouse",
      "Hold Left Control and drag for precise movements",
    ],
  },
  savedViews: {
    title: "Saved Views",
    icon: icons.savedViews,
    description: [
      "Save a camera angle, together with any clipping planes' positions defined with \"S\"",
      "Load any previously saved views with \"L\"",
      "Even more placeholder text"
    ],
  },
};

const header = {
  title: "Helper",
  icon: icons.helper,
  description: "Here you can find tips on how to work with this tool"
};

export { tips as HelperTips, header as HelperHeader };
