import CategoryByLevel from "./CategoryByLevel";

export default class Level {
  constructor(name) {
    this.name = name;
    this.categories = [];
  }
  addCategoryByID(name, ids) {
    const category = new CategoryByLevel(name);
    category.ids = ids;
    this.categories.push(category);
  }
}
