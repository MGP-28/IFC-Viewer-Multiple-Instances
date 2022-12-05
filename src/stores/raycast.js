import RaycastIntersectObject from "../models/raycastIntersectObject.js";
import { Raycaster, Vector2 } from "three";

let found = new RaycastIntersectObject(null, null);

const setFound = (RayIntObj) =>
  (found = new RaycastIntersectObject(RayIntObj.object, RayIntObj.idx));

const resetFound = () => (found = null);

const isFoundValid = () => {
  return found !== null;
};

const raycaster = new Raycaster();
setupRaycaster();

const mouse = new Vector2();

function setupRaycaster() {
  raycaster.firstHitOnly = true;
}
export let subsetRaycast = [];

export { found, setFound, resetFound, isFoundValid, raycaster, mouse };