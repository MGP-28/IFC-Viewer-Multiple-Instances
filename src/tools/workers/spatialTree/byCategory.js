onmessage = async (e) => {
  console.log("worker working");

  const objects = e.data;
  const _categories = {};

  objects.sort(sortObjectsByCategory);

  let currentCategory = undefined;
  for (let index = 0; index < objects.length; index++) {
    const object = objects[index];
    // If a new category is found, add it to the categories object as key
    if (object.category !== currentCategory) {
      currentCategory = object.category;
      _categories[object.category] = {
        title: object.category,
        children: []
      };
    }

    _categories[object.category].children.push(object);
  }

  const categories = Object.values(_categories);

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
