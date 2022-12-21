/**
 * viewId
 *
 * position: vec3
 */
export default class Annotation {
  constructor(position = undefined, viewId = undefined, content = undefined) {
    this.position = position ? position.clone() : undefined;
    this.viewId = viewId;
    this.content = content;
    this.userId = null;
  }
}
