export default class CategoryByLevel {
  constructor(name) {
    this.name = name;
    this.ids = [];
  }
  addID(id) {
    const index = this.ids.indexOf(id);
    if (index == -1) {
      this.ids.push(id);
    }
  }
}
