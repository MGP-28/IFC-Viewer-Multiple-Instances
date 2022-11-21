export default function startGroupSelection() {
  const gsContainer = document.createElement("div");
  gsContainer.classList.add("group-selection-container", "hidden");

  //
  gsContainer.textContent = "Content here!";
  //

  document.addEventListener("wereReady", async (event) => {
    //
  });

  return gsContainer;
}
