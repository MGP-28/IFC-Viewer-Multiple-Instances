export default class Level {
  constructor(name) {
    this.name = name;
    this.categories = [];
  }
  addCategory(category) {
    const index = this.categories.findIndex((x) => x.name === category.name);
    if (index == -1) {
      this.categories.push(category);
    } else throw new Error("Category already exists");
  }
  addMultipleCategories(categoriesArr) {
    categoriesArr.forEach((category) => {
      addCategory(category);
    });
  }
}
