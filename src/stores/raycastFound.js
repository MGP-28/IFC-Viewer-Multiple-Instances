import RaycastIntersectObject from "../models/raycastIntersectObject";

let found = new RaycastIntersectObject(null, null)

const setFound = (RayIntObj) => found = new RaycastIntersectObject(RayIntObj.object, RayIntObj.idx)

const resetFound = () => found = new RaycastIntersectObject(null, null)

const isFoundValid = () => found.object !== null

export { found, setFound, resetFound, isFoundValid }