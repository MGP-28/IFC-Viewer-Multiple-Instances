function capitalizeFirstLetter(text) {
  const firstLetter = text.charAt(0).toUpperCase();
  const _text = text.slice(1);
  return firstLetter + _text;
}

export { capitalizeFirstLetter }