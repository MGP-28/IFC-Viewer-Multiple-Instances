import materials from "../configs/materials.js"
import * as Scene from "../stores/scene.js"

function createSubset(model, [...ids], type){
//create subset for provided model
    const material = materials[type]
    model.loader.ifcManager.createSubset({
        modelID: 0,
        ids: ids,
        material: material,
        scene: Scene.scene,
        removePrevious: true
    })
}

function removeSubset(model, type){
// model from store, type is string (selected, highlighted, ...)
    const material = materials[type]
    model.loader.removeSubset(0, Scene.scene, material);
}

export {
    createSubset,
    removeSubset
}