function resetObject(object) {
  for (const key in object) {
    const prop = object[key];
    if (typeof prop === "object" && prop !== null) {
      resetObject(prop);
    } else {
      prop = undefined;
    }
  }
}

export { resetObject }