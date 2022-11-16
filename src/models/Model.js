// Main class for each model loaded into the viewer
//
// loader = IfcLoader instance created for this model
// model = IfcModel created and inserted into the scene
// categories [] = Collecton of categories used in the IFC model
// levels [] = Collection of levels used in the IFC model
// subsets [] = Collection of subsets seperated by category and level. See: subset model

export default class Model{
    constructor(){
        this.loader = undefined
        this.model = undefined
        this.categories = []
        this.levels = []
        this.subsets = []
    }
}