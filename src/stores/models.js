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

// Stores model names for UI integration
let modelNames = [];
const resetModelNames = () => modelNames = [];

// Set of categories used in all models
let usedCategories = new Set();
const resetUsedCategories = () => usedCategories = new Set();

// Stores spacial trees from all models loaded
let trees = [];
const resetTrees = () => trees = [];

export { 
    ifcModels, resetIfcModels,
    ifcLoaders, resetIfcLoaders,
    selectedProperties, setSelectedProperties,
    modelNames, resetModelNames,
    usedCategories, resetUsedCategories,
    trees, resetTrees
}