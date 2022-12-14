function removeElementsFromArray(array, elements) {
  elements.forEach((element) => {
    const index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1); 
    }
  });
}

function clearDuplicatesFromArray(array){
  return Array.from(new Set(array))
}

function resetArray(arr) {
  while (arr.length > 0) {
    arr.pop();
  }
}

export { removeElementsFromArray, clearDuplicatesFromArray, resetArray };
