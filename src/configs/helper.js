import { icons } from "./icons";

const tips = {
  clipping: {
    title: "Clipping planes",
    icon: icons.clipping,
    description: [
      "Project sized box that can have its faces dragged to cut the presented models",
      "Drag faces with the mouse",
      "Hold Left Control and drag for precise movements",
    ],
  },
  properties: {
    title: "Properties",
    icon: icons.properties,
    description: ["Placeholder text"],
  },
  spatialTree: {
    title: "Spatial Tree",
    icon: icons.spatialTree,
    description: ["Placeholder text"],
  },
};

const header = {
  title: "Helper",
  icon: icons.helper,
  description: "Here you can find tips on how to work with this tool"
};

export { tips as HelperTips, header as HelperHeader };
