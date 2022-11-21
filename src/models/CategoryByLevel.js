import { ifcCategoryIndex } from "../stores/categoryIndex";

export default class CategoryByLevel {
  constructor(name) {
    this.name = name;
    this.categoryId = ifcCategoryIndex[name]; // Possible undefined / null
    this.ids = [];
  }
  addObjectByID(expressId) {
    this.ids.push(expressId);
  }
}
