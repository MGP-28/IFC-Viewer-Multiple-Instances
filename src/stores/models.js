import emitGlobalEvent from "../helpers/emitEvent";

// Model class instances
let models = [];
const addModel = (model) => models.push(model);
const resetModels = () => models = [];
function isAllModelsLoaded(){
    for (let idx = 0; idx < models.length; idx++) {
        if ( models[idx].model !== undefined ) continue
        else return false
    }
    return true
}

// Currently selected object's properties
let selectedProperties = undefined;
const setSelectedProperties = (props) => {
    selectedProperties = props
    emitGlobalEvent('selectedChanged')
}

// Set of categories used in all models
let usedCategories = new Set();
const resetUsedCategories = () => usedCategories = new Set();
const addCategories = (categories) => {
    const arr = [...usedCategories].concat(categories)
    usedCategories = new Set(arr)
}

export { 
    models, addModel, resetModels, isAllModelsLoaded,
    selectedProperties, setSelectedProperties,
    usedCategories, resetUsedCategories, addCategories
}