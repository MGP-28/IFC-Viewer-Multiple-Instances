/**
 * Finds any special character code and convertes it to the proper form
 * @param {string} string Input string to be cleared
 * @returns String correctly displayed
 */
function clearString(string) {
  if(string.includes("Muro")) console.log(string)
  const split = string.split(":");
  string = split[0] == "" ? split[1] : split[0];
  // \x\e1 -> \n00e1
  // \x2\00e1\x0\ -> \n00e1
  const replaced = [
    {
      expression: /\\[xX]\\/g, // \x\
      replacement: "\\u00",
    },
    {
      expression: /\\[xX]2\\/g, // \x2\
      replacement: "\\u",
    },
    {
      expression: /\\[xX]0\\/g, // \x0\
      replacement: "",
    },
  ];
  replaced.forEach((obj) => {
    string = string.replace(obj.expression, obj.replacement);
  });

  try {
    let unicodeStartIndex = string.indexOf("\\u");
    while (unicodeStartIndex > -1) {
      // \n00e1
      const unicodeLength = 6;
      const fullUnicode = string.substr(unicodeStartIndex, unicodeLength);
      // 00e1
      const unicodeCodeIndex = unicodeStartIndex + 2;
      const unicodeCodeLength = 4;
      // Get unicode value of escape sequence
      const unicodeValue = parseInt(string.substr(unicodeCodeIndex, unicodeCodeLength), 16);
      // Convert from unicode to actual character code
      const characterCode = String.fromCodePoint(unicodeValue);
      // Replace unicode escape sequence with corresponding character code
      string = string.replace(fullUnicode, characterCode);
      // Get next unicode escape sequence, if it exists
      unicodeStartIndex = string.indexOf("\\u");
    }
  } catch (error) {
    console.log("Error parsing title", error);
  } finally {
    return string;
  }
}

export { clearString };
