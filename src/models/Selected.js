import { clearDuplicatesFromArray } from "../helpers/generic/arrays";

export default class Selected {
  constructor() {
    this.props = undefined;
    // objects = {
    //      0: [...ids],
    //      1: [...ids],
    //      ...
    // }
    this.objects = {};
  }
  addProps(props, ids, modelIdx) {
    this.props = props;
    if (this.objects[modelIdx] === undefined) this.objects[modelIdx] = [];
    this.objects[modelIdx] = clearDuplicatesFromArray(
      this.objects[modelIdx].concat(ids)
    );
  }
  reset() {
    this.props = undefined;
    for (const key in this.objects) {
      this.objects[key] = [];
    }
  }
  isValid() {
    return hasOneObject();
  }
  isGroupSelection() {
    return hasMultipleObject();
  }
  includesObjectByID(modelIdx, expressID) {
    const objectsByModel = this.objects[modelIdx];
    if (objectsByModel === undefined) return false;
    return objectsByModel.includes(expressID);
  }
}

function hasOneObject() {
  let counter = 0;
  for (const key in this.objects) {
    counter += this.objects[key].length;
    if (counter > 0) return true;
  }
  return false;
}

function hasMultipleObject() {
  let counter = 0;
  for (const key in this.objects) {
    counter += this.objects[key].length;
    if (counter > 1) return true;
  }
  return false;
}

function countObjects() {
  let counter = 0;
  for (const key in this.objects) {
    counter += this.objects[key].length;
  }
  return counter;
}
