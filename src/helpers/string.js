/**
 * Finds any special character code and convertes it to the proper form
 * @param {string} value Input string to be cleared
 * @returns String correctly displayed
 */
function clearString(value) {
  let index = value.indexOf("\\");
  while (index > 0) {
    const code = String.fromCodePoint("0x".concat(value.substr(index + 4, 4)));
    const del = value.substr(index, 12);
    value = value.replace(del, code);
    index = value.indexOf("\\");
  }
  return value;
}

export { clearString };
