/**
 * Orders arrays and checks if they have the same elements
 * @param {Array} a 
 * @param {Array} b 
 * @returns true if arrays have the same elements, otherwise false
 */
function isArrayEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  const t1 = Array.from(a).sort();
  const t2 = Array.from(b).sort();

  for (var i = 0; i < a.length; ++i) {
    if (t1[i] !== t2[i]) return false;
  }
  return true;
}

/**
 * Checks if array b includes all the elements of a
 * @param {Array} arrayToCheck 
 * @param {Array} elementsToCheck 
 * @returns true if arrayToCheck includes all of the elements of ElementsToCheck, otherwise false
 */
function isArrayPartOfArray(arrayToCheck, elementsToCheck){
  if (arrayToCheck === elementsToCheck) return true;
  if (arrayToCheck == null || elementsToCheck == null) return false;

  for (var i = 0; i < elementsToCheck.length; ++i) {
    const element = elementsToCheck[i]
    if(!arrayToCheck.includes(element)) return false
  }
  return true;
}

export { isArrayEqual, isArrayPartOfArray }