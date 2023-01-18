onmessage = async (e) => {
  console.log("worker working");

  const objects = e.data;
  const categories = {};

  objects.sort(sortObjectsByCategory);

  let currentCategory = undefined;
  for (let index = 0; index < objects.length; index++) {
    const object = objects[index];
    // If a new category is found, add it to the categories object as key
    if (object.category !== currentCategory) {
      currentCategory = object.category;
      categories[object.category] = [];
    }

    categories[object.category].push(object);
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
