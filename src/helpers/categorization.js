import * as Models from "../stores/models";

// Get a set of all categories from all models
async function getAllUsedCategories(){
	//
}

// Setup all categories
async function setupAllCategories() {
	const allCategories = Object.values(categories);
	for (let i = 0; i < allCategories.length; i++) {
		const category = allCategories[i];
		await setupCategory(category);
	}
}

// Creates a new subset and configures the checkbox
async function setupCategory(category) {
	subsets[category] = await newSubsetOfType(category);
	setupCheckBox(category);
}

// Creates a new subset containing all elements of a category
async function newSubsetOfType(category) {
	const ids = await getAll(category);
	return ifcLoader.ifcManager.createSubset({
		modelID: 0,
		scene,
		ids,
		removePrevious: true,
		customID: category.toString(),
	});
}

// Gets all the items of a category
async function getAll(category) {
	return ifcLoader.ifcManager.getAllItemsOfType(0, category, false);
}