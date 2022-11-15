import emitGlobalEvent from "../helpers/emitEvent";

// IFC Models loaded
const ifcModels = [];
const resetIfcModels = () => ifcModels = [];

// IFC Loaders -> One for each model
const ifcLoaders = [];
const resetIfcLoaders = () => ifcLoaders = [];

// Currently selected object's properties
let selectedProperties = undefined;
const setSelectedProperties = (props) => {
    selectedProperties = props
    emitGlobalEvent('selectedChanged')
}

const modelNames = [];
const usedCategories = [];

export { 
    ifcModels, resetIfcModels,
    ifcLoaders, resetIfcLoaders,
    selectedProperties, setSelectedProperties,
    modelNames, 
    usedCategories
}