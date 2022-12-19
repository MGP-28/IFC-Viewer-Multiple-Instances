/**
 * camera: position, pointLookedAt
 *
 * clipping: min, max
 */
export default class SavedView {
  constructor(camera = undefined, clipping = undefined) {
    this.note = undefined;
    this.id = undefined;
    this.camera = {
      position: camera ? camera.position.clone() : undefined,
      pointLookedAt: camera ? camera.pointLookedAt.clone() : undefined,
    };
    this.clipping = {
      min: clipping ? clipping.min.clone() : undefined,
      max: clipping ? clipping.max.clone() : undefined,
    };
  }
}
