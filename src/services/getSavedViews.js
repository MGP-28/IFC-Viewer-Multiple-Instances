import SavedView from "../models/SavedView";
import { loadFromLS } from "./localStorage";
import * as THREE from 'three'

function getSavedViews() {
  const LSData = loadFromLS("savedViews");
  if (LSData) {
    const results = [];
    LSData.forEach((element) => {
       const savedView = new SavedView();
       savedView.camera.position = convertJSONToVector(element.camera.position).clone();
       savedView.camera.pointLookedAt = convertJSONToVector(element.camera.pointLookedAt).clone();
       savedView.clipping.min = convertJSONToVector(element.clipping.min).clone();
       savedView.clipping.max = convertJSONToVector(element.clipping.max).clone();
       savedView.id = element.id;
       savedView.note = element.note;
       results.push(savedView);
    });
    console.log(results)
    return results;
  }
  return null;
}

function convertJSONToVector(obj){
    const vec = new THREE.Vector3(obj.x, obj.y, obj.z)
    return vec;
}

export { getSavedViews };
