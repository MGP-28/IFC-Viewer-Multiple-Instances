export function buildIcon(iconFileName) {
  const iconDirectory = `./src/assets/icons/${iconFileName}.svg`;

  const icon = document.createElement("img");
  icon.src = iconDirectory;

  return icon;
}
