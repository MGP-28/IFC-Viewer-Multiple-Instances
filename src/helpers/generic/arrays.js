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

export { removeElementsFromArray, clearDuplicatesFromArray };
