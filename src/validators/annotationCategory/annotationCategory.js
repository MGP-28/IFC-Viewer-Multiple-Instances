import { annotationCategoryRefRegex } from "../../helpers/repositories/regex";
import { annotationCategories } from "../../stores/annotationCategories";

function annotationCategoryValidator(annotationCategory) {

  let errors = [];

  const {name, reference, color} = annotationCategory;

  if (!name) errors.push("Name is empty");

  const categoriesNamesUsed = annotationCategories.map((x) => x.name);
  const isNameValid = categoriesNamesUsed.indexOf(name) == -1;
  if (!isNameValid) errors.push("Name is already in use");

  const regexPattern = annotationCategoryRefRegex();
  const regex = new RegExp(regexPattern);
  const result = regex.test(reference);
  if(!result) errors.push("Reference is in an incorrect format");

  const referencesUsed = annotationCategories.map((x) => x.reference);
  const isReferenceValid = referencesUsed.indexOf(reference) == -1;
  if (!isReferenceValid) errors.push("Reference is already in use");

  const colorsUsed = annotationCategories.map((x) => x.color);
  const isColorValid = colorsUsed.indexOf(color) == -1;
  if (!isColorValid) errors.push("Color is already in use");

  return errors.length == 0 ? true : errors;
}

export { annotationCategoryValidator };
