onmessage = async (e) => {
  const { objects, levels } = e.data;

  // Sorts objects by level id
  objects.sort((a, b) => {
    return a.levelId - b.levelId;
  });

  const tree = objects.reduce((acc, cv) => {
    const levelData = levels.find(x => x.modelIdx == cv.modelIdx && x.expressId == cv.levelId);
    let level = acc.find((x) => x.title == levelData.name);

    if (level === undefined) {
      const levelObj = {
        title: levelData.name,
        children: [],
      };
      acc.push(levelObj);
      level = levelObj;
    }

    const categoryName = cv.category;
    let category = level.children.find((x) => x.title == categoryName);

    if (category === undefined) {
      const categoryObj = {
        title: categoryName,
        children: [],
      };
      level.children.push(categoryObj);
      category = categoryObj;
    }

    category.children.push(cv);
    return acc;
  }, []);

  postMessage(tree);
};

self.addEventListener("unhandledrejection", function (event) {
  throw event.reason;
});

function sortObjectsByLevel(a, b) {
  // Compare the 2 dates
  if (a.levelId < b.levelId) return -1;
  if (a.levelId > b.levelId) return 1; 
  return 0;
}

function sortObjectsByCategory(a, b) {
  // Compare the 2 dates
  if (a.category < b.category) return -1;
  if (a.category > b.category) return 1;
  return 0;
}
