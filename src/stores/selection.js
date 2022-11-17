import emitGlobalEvent from "../helpers/emitEvent";

// Currently selected object's properties
let selectedProperties = undefined;
const setSelectedProperties = (props, isSelection) => {
  selectedProperties = props;
  if(isSelection) emitGlobalEvent("selectedChanged");
  else emitGlobalEvent("highlightedChanged");
};

export { selectedProperties, setSelectedProperties };
