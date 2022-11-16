import { ifcLoaders } from "../stores/models";

async getSpacialTree(loaderIdx){
    const ifcLoader = ifcLoaders[loaderIdx];
    const ifcProject = await ifcLoader.ifcManager.getSpatialStructure(0);
    return ifcProject;
}