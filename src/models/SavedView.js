/**
 * camera: position, pointLookedAt
 *
 * clipping: min, max
 */
export default class SavedView {
  constructor(camera = undefined, clipping = undefined, hiddenIds = undefined) {
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

    const _hiddenIds = hiddenIds ? JSON.parse(JSON.stringify(hiddenIds)) : {};

    this.hiddenIds = this.parseIds(_hiddenIds);
  }
  parseIds(hiddenIds) {
    let newHiddenIdsByModel = {};
    // parse values to Int (issue with them being strings and not functioning correctly)
    for (const modelIdx in hiddenIds) {
      if (Object.hasOwnProperty.call(hiddenIds, modelIdx)) {
        const _hiddenIds = hiddenIds[modelIdx];
        const newHiddenIds = _hiddenIds.reduce((pV, cV) => {
          const num = parseInt(cV);
          pV.push(num);
          return pV;
        }, []);
        newHiddenIdsByModel[modelIdx] = newHiddenIds;
      }
    }
    return newHiddenIdsByModel;
  }
}
