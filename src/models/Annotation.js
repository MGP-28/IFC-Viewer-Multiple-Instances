/**
 * viewId
 *
 * position: vec3
 */
export default class Annotation {
  constructor(position = undefined, viewId = undefined, categoryId = undefined, content = undefined) {
    this.id = undefined;
    this.position = position ? position.clone() : undefined;
    this.viewId = viewId;
    this.categoryId = categoryId;
    this.content = content;
    this.userId = null;
  }
}
