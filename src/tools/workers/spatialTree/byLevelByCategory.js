onmessage = async (e) => {
  console.log("worker working");

  const { objects, levels } = e.data;

  const tree = objects.reduce((acc, cv) => {
    console.log("cv", cv);
    const levelData = levels.find(x => x.modelIdx == cv.modelIdx && x.levelId == cv.levelId);
    console.log("levelData", levelData);
    let level = acc.find((x) => x.name == levelName);
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

  console.log("objects by level by category", tree);

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
