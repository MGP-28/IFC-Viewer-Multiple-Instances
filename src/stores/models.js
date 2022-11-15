import emitGlobalEvent from "../helpers/emitEvent";

const ifcModels = [];
const resetIfcModels = () => ifcModels = [];

const ifcLoaders = [];
const resetIfcLoaders = () => ifcLoaders = [];

let selectedProperties = undefined;
const setSelectedProperties = (props) => {
    selectedProperties = props
    emitGlobalEvent('selectedChanged')
}

export { 
    ifcModels, resetIfcModels,
    ifcLoaders, resetIfcLoaders,
    selectedProperties, setSelectedProperties
}