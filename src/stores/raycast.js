import RaycastIntersectObject from "../models/raycastIntersectObject.js";
import {
    Raycaster,
    Vector2
  } from "three";

let found = new RaycastIntersectObject(null, null)

const setFound = (RayIntObj) => found = new RaycastIntersectObject(RayIntObj.object, RayIntObj.idx)

const resetFound = () => found = new RaycastIntersectObject(null, null)

const isFoundValid = () => found.object !== null

const raycaster = new Raycaster();
setupRaycaster()

const mouse = new Vector2();

export { found, setFound, resetFound, isFoundValid, raycaster, mouse }

function setupRaycaster(){
    raycaster.firstHitOnly = true;
}