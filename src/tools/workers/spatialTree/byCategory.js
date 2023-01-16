onmessage = async (e) => {
  const objects = e.data;
  const categories = {};

  objects.sort(sortObjectsByCategory);

  let currentCategory = undefined;
  for (let index = 0; index < objects.length; index++) {
    const object = objects[index];
    // If a new category is found, create HTML element to append objects
    if (object.category !== currentCategory) {
      currentCategory = object.category;
      categories[object.category] = [];
    }

    // Object data element
    const model = Models.models[object.modelIdx];
    const props = await model.loader.ifcManager.getItemProperties(0, object.expressId);

    const leafNode = {
      node: object,
      props,
    };

    categories[object.category].push(leafNode);
  }

  postMessage(categories);
};

self.addEventListener("unhandledrejection", function (event) {
  throw event.reason;
});

function sortObjectsByCategory(a, b) {
  // Compare the 2 dates
  if (a.category < b.category) return -1;
  if (a.category > b.category) return 1;
  return 0;
}
