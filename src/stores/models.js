const ifcModels = [];
const resetIfcModels = () => ifcModels = [];

const ifcLoaders = [];
const resetIfcLoaders = () => ifcLoaders = [];

let selectedProperties = undefined;
const setSelectedProperties = (props) => {
    selectedProperties = props
    selectedChanged()
}

function selectedChanged(){
    const event = new Event('selectedChanged')
    document.dispatchEvent(event)
}

export { 
    ifcModels, resetIfcModels,
    ifcLoaders, resetIfcLoaders,
    selectedProperties, setSelectedProperties
}