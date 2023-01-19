onmessage = async (e) => {
  const { objects, levels } = e.data;

  const tree = objects.reduce((acc, cv) => {
    const levelData = levels.find(x => x.modelIdx == cv.modelIdx && x.levelId == cv.levelId);
    let level = acc.find((x) => x.name == levelData.name);
    if (level === undefined) {
      const levelObj = {
        name: levelData.name,
        categories: [],
      };
      acc.push(levelObj);
      level = levelObj;
    }
    const categoryName = cv.category;
    let category = level.categories.find((x) => x.name == categoryName);
    if (category === undefined) {
      const categoryObj = {
        name: categoryName,
        objects: [],
      };
      level.categories.push(categoryObj);
      category = categoryObj;
    }
    category.objects.push(cv);
    return acc;
  }, []);

  postMessage(tree);
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
