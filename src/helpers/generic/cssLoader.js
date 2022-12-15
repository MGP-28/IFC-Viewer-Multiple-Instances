function loadCSS(filePathFromRoot) {
  const link = document.createElement("link");
  link.href = filePathFromRoot;
  link.type = "text/css";
  link.rel = "stylesheet";

  document.getElementsByTagName("head")[0].appendChild(link);
}

export { loadCSS }