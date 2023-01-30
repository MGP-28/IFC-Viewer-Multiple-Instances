import * as Models from "../stores/models";

async function getPsets(modelIdx, expressId) {
  const model = Models.models[modelIdx];
  const promises = [];
  const _psets = await model.loader.ifcManager.getPropertySets(0, expressId);
  for (let idx = 0; idx < _psets.length; idx++) {
    const pset = _psets[idx];
    if (!pset.HasProperties) continue;
    pset.props = [];

    // get pset props as a promise - performance increase
    promises.push(getPropsFromPset(model, pset, idx));
  }

  // Ensure all promises are resolved, then add the recovered props to the corresponding pset
  const _psetsData = await Promise.all(promises);
  const psetsData = _psetsData.map(psetData => {
    _psets[psetData.ref].props = psetData.props
    return _psets[psetData.ref];
  })

  return psetsData;
}

async function getPropsFromPset(model, pset, ref) {
  const promises = [];
  for (let idx = 0; idx < pset.HasProperties.length; idx++) {
    const propRef = pset.HasProperties[idx];
    if (!propRef.value) continue;
    // push promise
    promises.push(model.loader.ifcManager.getItemProperties(0, propRef.value));
  }
  // use promises.all instead of just awaiting for "getItemProperties" to improve performance
  return Promise.all(promises).then((props) => {
    return { ref, props };
  });
}

export { getPsets };
