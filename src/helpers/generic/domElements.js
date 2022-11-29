/**
 *
 * @param {*} tag
 * @param {*} details
 * @returns HTMLElement
 */
function createElement(tag, details = undefined) {
  // try {
    const element = document.createElement(tag);
    if (details) {
      if (details["classes"]) {
        details["classes"].forEach((cl) => {
          element.classList.add(cl);
        });
      }
      if (details["attributes"]) {
        for (const key in details["attributes"]) {
          element.setAttribute(key, details["attributes"][key]);
        }
      }
      for (const key in details) {
        if (key !== "classes" && key !== "attributes") {
          element[key] = details[key];
        }
      }
    }

    return element;
  // } catch {
  //   return new Error("Invalid parameters");
  // }
}

export { createElement };
